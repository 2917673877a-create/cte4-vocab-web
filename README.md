# cte4-vocab-web

一个基于 Next.js、TypeScript 和 Tailwind CSS 的简单 CET-4 单词学习项目。

## 功能

- `/` 首页：展示单词列表
- `/word/[id]` 单词详情页
- `/review` 复习页面
- `GET /api/words`：返回单词列表 JSON

## 单词数据结构

```ts
type Word = {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  audioUrl: string;
};
```

## 启动步骤

```bash
npm install
npm run dev
```

打开 <http://localhost:3000> 查看页面。

## API 示例

访问 <http://localhost:3000/api/words> 获取单词列表。
