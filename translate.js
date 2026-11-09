export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { text, from, to } = req.body || {};
  if (typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ error: "请先输入要翻译的内容。" });
  }
  if (text.length > 3000) {
    return res.status(400).json({ error: "内容太长，请控制在 3,000 字以内。" });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "网站尚未设置 OPENAI_API_KEY，请在部署平台的环境变量中添加。" });
  }

  const prompt = `你是一位熟悉新加坡英语（Singlish）和马来西亚英语（Manglish）的双语口语翻译助手。
请把用户内容从${from || "中文"}翻译成${to || "新马英语口语"}。
规则：
- 表达自然、轻松、简短，适合 WhatsApp 日常聊天。
- 若目标是新马英语口语，可适度使用 lah、leh、lor、meh、hor 等当地常见语气词，但不要过度使用，也不要为了加入语气词而改变意思。
- 保留原文意思、语气、情绪和幽默，不擅自添加内容。
- 若目标是中文，翻译成自然、通顺的中文。
- 只输出译文，不要解释、不要加引号、不要列出多个版本。`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: prompt,
        input: text
      })
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "翻译服务暂时不可用。"
      });
    }
    const translation = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n").trim();
    if (!translation) return res.status(502).json({ error: "没有收到有效译文，请重试。" });
    return res.status(200).json({ translation });
  } catch {
    return res.status(500).json({ error: "服务器连接翻译服务失败，请稍后重试。" });
  }
}