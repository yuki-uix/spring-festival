# 春节祝福生成器 🧧

> 用 AI 生成独特的春节祝福语和趣味表情包

[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue)](https://reactjs.org/)
[![Tambo AI](https://img.shields.io/badge/Tambo%20AI-Powered-green)](https://tambo.co/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

---

## ✨ 功能特色

- 🧧 **春节祝福语生成**：4种风格（传统、幽默、文艺、商务）
- 😄 **趣味表情包创意**：4种风格（喜庆、搞笑、可爱、创意）
- 🤖 **AI 驱动**：基于 Tambo AI 的智能内容生成
- 📋 **一键操作**：快速复制和分享
- 🎨 **春节主题**：喜庆的视觉设计
- 📱 **响应式**：完美支持移动端和桌面端

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

打开浏览器访问：http://localhost:3000

---

## 📱 应用界面

### 🏠 首页
两个主要功能入口：
- **✨ 春节祝福语**：生成个性化的春节祝福语
- **😄 趣味表情包**：生成创意表情包方案

### 📝 祝福语生成器 (`/blessings`)
支持多种风格的祝福语生成：
- 🧧 传统风格：经典成语和吉祥话
- 😄 幽默风格：轻松诙谐的祝福
- 📝 文艺风格：优美抒情的表达
- 💼 商务风格：正式得体的祝福

### 🎨 表情包生成器 (`/memes`)
完整的表情包创意方案：
- 🎊 喜庆风格：充满节日氛围
- 😂 搞笑风格：幽默诙谐
- 🥰 可爱风格：萌系治愈
- 💡 创意风格：独特新颖

---

## 📖 文档

| 文档 | 描述 |
|------|------|
| [快速开始](./QUICK_START.md) | 3步开始使用 |
| [用户指南](./USER_GUIDE.md) | 详细的使用教程 |
| [开发者指南](./DEVELOPER_GUIDE.md) | 技术文档和扩展指南 |
| [设计指南](./DESIGN_GUIDE.md) | UI/UX 设计说明 |
| [项目总结](./PROJECT_SUMMARY.md) | 项目完成情况 |
| [功能清单](./CHECKLIST.md) | 功能检查清单 |

---

## 🛠️ 技术栈

- **框架**：Next.js 15.4.1 + React 19.1.0
- **语言**：TypeScript
- **AI**：Tambo AI SDK
- **样式**：Tailwind CSS v4
- **验证**：Zod
- **工具**：ESLint

---

## 📂 项目结构

```
my-app/
├── src/
│   ├── app/                    # Next.js 页面
│   │   ├── page.tsx           # 首页
│   │   ├── blessings/         # 祝福语功能
│   │   └── memes/             # 表情包功能
│   ├── components/
│   │   └── tambo/             # Tambo 组件
│   │       ├── blessing-card.tsx
│   │       └── meme-card.tsx
│   └── lib/
│       └── tambo.ts           # 组件注册
├── public/                     # 静态资源
└── docs/                       # 文档（各种 .md 文件）
```

---

## 💡 使用示例

### 生成祝福语

```
输入：生成一条给父母的传统祝福语
输出：带有传统成语和吉祥话的精美祝福语卡片
```

### 生成表情包

```
输入：生成一个抢红包的搞笑表情包
输出：完整的创意方案（画面描述 + 文案 + 设计要点）
```

---

## 🎯 核心特性

### AI 智能生成
- 基于自然语言理解用户需求
- 自动匹配合适的风格和内容
- 生成高质量、个性化的内容

### 组件化设计
- 模块化的代码结构
- 易于维护和扩展
- 可复用的 UI 组件

### 用户友好
- 直观的界面设计
- 清晰的使用指南
- 快速的操作反馈

---

## 📊 项目状态

- ✅ 核心功能：100% 完成
- ✅ 文档编写：100% 完成
- ✅ 代码质量：ESLint 通过
- ✅ 测试验证：功能正常
- ✅ 生产就绪：可部署

---

## 🚀 部署

### Vercel（推荐）

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 一键部署

### 其他平台

支持任何支持 Next.js 的平台：
- Netlify
- AWS
- 自托管

---

## 📝 开发命令

```bash
# 开发
npm run dev          # 启动开发服务器

# 构建
npm run build        # 构建生产版本
npm run start        # 启动生产服务器

# 代码检查
npm run lint         # 运行 ESLint
npm run lint:fix     # 自动修复问题
```

---

## 🤝 贡献

欢迎贡献代码！请查看 [开发者指南](./DEVELOPER_GUIDE.md) 了解如何参与开发。

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Tambo AI](https://tambo.co) - AI 能力支持
- [Next.js](https://nextjs.org) - Web 框架
- [Tailwind CSS](https://tailwindcss.com) - 样式框架

---

## 📞 联系方式

有问题或建议？欢迎反馈！

---

<div align="center">

**🎊 祝你新春快乐，万事如意！🎊**

Made with ❤️ for Spring Festival 2026

</div>
