# 新马口语翻译器

这是一个可部署到 Vercel 的轻量网页项目，支持：
- 中文 → 新加坡／马来西亚英语口语
- 英文 → 自然中文
- 翻译、清空、一键复制
- 手机与电脑自适应布局

## 部署到 Vercel

1. 将本项目文件夹上传到一个 GitHub 仓库。
2. 登录 https://vercel.com/ ，选择 **Add New → Project**，导入该 GitHub 仓库。
3. 在项目的 **Settings → Environment Variables** 添加：
   - Name: `OPENAI_API_KEY`
   - Value: 你的 OpenAI API key
4. （可选）添加 `OPENAI_MODEL`，值设为你账户可用的模型名称；不填时默认使用 `gpt-4.1-mini`。
5. 点击 Deploy。部署完成后，Vercel 会提供一个 `https://...vercel.app` 网址。

## 本地预览

此项目使用 Vercel Serverless Function（`api/translate.js`）。安装 Vercel CLI 后，在项目目录运行：

```bash
npm i -g vercel
vercel dev
```

## 安全提醒

- **不要**把 API key 写进 `index.html` 或提交到 GitHub。
- API key 只放在 Vercel 的环境变量中。
- 调用模型 API 可能产生费用，费用取决于你的 API 账户与用量。
