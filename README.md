# Lunar New Year Blessing Generator 🧧

> AI-powered Lunar New Year blessing and meme generator built with Tambo AI

[![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue)](https://reactjs.org/)
[![Tambo AI](https://img.shields.io/badge/Tambo%20AI-0.74.1-green)](https://tambo.co/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

[English](#english) | [中文](#中文)

---

## English

### ✨ Key Features

#### 🧧 Lunar New Year Blessing Generator
- **Multiple Styles**: Choose from Traditional, Humorous, Literary, or Business styles
- **Personalization**: Generate custom blessings for family, friends, colleagues, or clients
- **Smart Interaction**: Like/dislike feedback system helps AI optimize future content
- **One-Click Sharing**: Easily copy and share blessings

#### 😄 Fun Meme Generator
- **Creative Ideas**: AI generates complete meme concepts with descriptions, captions, and design tips
- **Four Styles**: Festive, Funny, Cute, and Creative
- **Actual Image Generation**: Integrated with Alibaba Cloud DashScope to create real meme images
- **Smart Rating**: 5-star rating system helps AI understand your preferences
- **Quick Optimization**: One-click adjustments (more humorous, simpler, more detailed, different scenario)

#### 🌍 Internationalization
- **Bilingual Support**: Complete Chinese/English interface switching
- **Smart Memory**: Automatically saves user language preferences

---

### 🚀 Quick Start

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Configure Environment Variables

Create a `.env.local` file:

```bash
# Tambo AI API Key (Required)
# Get yours at: https://tambo.co
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key

# Alibaba Cloud DashScope API Key (Optional, for image generation)
# Get yours at: https://bailian.console.aliyun.com/
DASHSCOPE_API_KEY=your_dashscope_api_key
```

#### 3. Start Development Server

```bash
npm run dev
```

#### 4. Open Application

Visit in your browser: [http://localhost:3000](http://localhost:3000)

---

### 📱 Application Pages

#### 🏠 Home Page (`/`)
- Application introduction and feature showcase
- Two main feature entrances: Blessing Generator and Meme Generator
- API Key configuration check

#### ✨ Blessing Generator (`/blessings`)
- Intelligent conversational blessing generation
- Multiple styles and audience customization
- Interactive blessing cards with like/dislike feedback
- One-click copy and share

#### 😄 Meme Generator (`/memes`)
- Creative meme concept generation
- Actual image generation support (requires DASHSCOPE_API_KEY)
- 5-star rating system
- Quick optimization buttons (more humorous, simpler, etc.)
- Image download and sharing

#### 💬 General Chat (`/chat`)
- Tambo AI conversation interface demo
- Showcases full Tambo framework capabilities

#### 🎯 Interactive Components Demo (`/interactables`)
- Tambo Interactable component feature showcase

---

### 🛠️ Tech Stack

#### Core Technologies
- **Framework**: Next.js 15.5.7 (App Router)
- **UI Library**: React 19.1.1
- **Language**: TypeScript 5
- **AI SDK**: @tambo-ai/react ^0.74.1
- **Styling**: Tailwind CSS v4
- **Data Validation**: Zod
- **Rich Text Editor**: TipTap
- **Icons**: Lucide React
- **Animations**: Framer Motion

#### AI Integration
- **Tambo AI**: Main AI conversation and UI generation engine
- **DashScope**: Image generation service (Alibaba Cloud)

#### Key Features
- **Component Registration System**: Register React components in `src/lib/tambo.ts` for AI dynamic control
- **Tool System**: External functions that AI can invoke (e.g., image generation)
- **Streaming Response**: Real-time streaming updates of AI-generated content
- **Interactive Components**: Two-way AI-component communication using `withInteractable` HOC

---

### 📂 Project Structure

```
my-app/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Home page
│   │   ├── blessings/              # Blessing generator page
│   │   ├── memes/                  # Meme generator page
│   │   ├── chat/                   # General chat page
│   │   ├── interactables/          # Interactive components demo
│   │   ├── api/                    # API routes
│   │   │   ├── generate-image/     # Image generation API
│   │   │   └── proxy-image/        # Image proxy API
│   │   └── layout.tsx              # Root layout (TamboProvider)
│   ├── components/
│   │   ├── tambo/                  # Tambo-related components
│   │   │   ├── blessing-card.tsx   # Blessing card (data definition)
│   │   │   ├── interactive-blessing-card.tsx  # Interactive blessing card
│   │   │   ├── meme-card.tsx       # Meme card (data definition)
│   │   │   ├── interactive-meme-card.tsx      # Interactive meme card
│   │   │   ├── generated-meme-image.tsx       # Generated image display
│   │   │   ├── graph.tsx           # Chart component
│   │   │   ├── message*.tsx        # Message-related components
│   │   │   └── thread*.tsx         # Thread components
│   │   ├── ui/                     # General UI components
│   │   ├── ApiKeyCheck.tsx         # API Key validation
│   │   └── LanguageSwitcher.tsx    # Language switcher
│   ├── hooks/
│   │   └── useLanguage.ts          # Language management hook
│   ├── lib/
│   │   ├── tambo.ts                # 🔥 Core config: Component & tool registration
│   │   ├── i18n.ts                 # Internationalization config
│   │   └── utils.ts                # Utility functions
│   ├── locales/
│   │   └── translations.ts         # Translation texts
│   └── services/
│       ├── image-generation.ts     # Image generation service
│       └── population-stats.ts     # Example data service
├── public/                         # Static assets
├── .env.local                      # Environment variables (create yourself)
├── package.json                    # Project dependencies
├── tsconfig.json                   # TypeScript config
├── tailwind.config.ts              # Tailwind config
├── CLAUDE.md                       # Claude AI development guide
└── README.md                       # Project documentation
```

---

### 🎯 Core Concepts

#### 1. Tambo Component Registration

Register components in `src/lib/tambo.ts` to enable AI dynamic rendering:

```typescript
export const components: TamboComponent[] = [
  {
    name: "BlessingCard",
    description: "Interactive Lunar New Year blessing card component...",
    component: InteractiveBlessingCard,
    propsSchema: blessingCardSchema, // Zod schema
  },
  // More components...
];
```

#### 2. Tambo Tool Registration

Register functions that AI can invoke:

```typescript
export const tools: TamboTool[] = [
  {
    name: "generateMemeImage",
    description: "Generate Lunar New Year meme images...",
    tool: generateMemeImage,
    inputSchema: z.object({...}),
    outputSchema: z.object({...}),
  },
  // More tools...
];
```

#### 3. Interactive Components

Create components with two-way AI communication using `withInteractable` HOC:

```typescript
export const InteractiveBlessingCard = withInteractable(
  BlessingCard,
  "BlessingCard"
);
```

User actions (like, dislike, optimization requests) are automatically sent back to AI to help optimize future responses.

---

### 💡 Usage Examples

#### Generate Blessing

```
User Input: Generate a traditional blessing for my parents
AI Response: Renders BlessingCard component with beautiful blessing card
User Action: Clicks "👍 Like" button
AI Learning: Remembers user preference, generates more similar style blessings
```

#### Generate Meme

```
User Input: Generate a funny meme about grabbing red envelopes
AI Response: Renders MemeCard component with creative concept
User Actions:
  1. Gives 5-star rating
  2. Clicks "Generate Image" button
AI Calls: generateMemeImage tool
AI Response: Renders GeneratedMemeImage component with actual image
User Action: Downloads or copies image URL
```

---

### 📋 Development Commands

```bash
# Development
npm run dev              # Start development server (localhost:3000)

# Production
npm run build            # Build production version
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint check
npm run lint:fix         # Auto-fix ESLint issues

# Tambo Tools
npx tambo help           # View Tambo CLI help
npx tambo init           # Initialize Tambo project
```

---

### 🔧 Extension Guide

#### Adding New Tambo Components

1. Create component file in `src/components/tambo/`
2. Define props schema with Zod
3. Register component in `src/lib/tambo.ts`
4. (Optional) Create interactive version with `withInteractable`

#### Adding New Tools

1. Implement tool function in `src/services/`
2. Define Zod input/output schema
3. Register tool in `src/lib/tambo.ts`

#### Adding Internationalization Texts

1. Add translation key-values in `src/locales/translations.ts`
2. Use `useLanguage()` and `createTranslator()` in components

---

### 🚀 Deployment

#### Vercel (Recommended)

1. Push code to GitHub/GitLab
2. Import project on [Vercel](https://vercel.com)
3. Configure environment variables:
   - `NEXT_PUBLIC_TAMBO_API_KEY`
   - `DASHSCOPE_API_KEY` (optional)
4. One-click deploy

#### Other Platforms

Supports any platform that supports Next.js:
- **Netlify**: Supports Next.js App Router
- **AWS Amplify**: Full support
- **Self-hosted**: Use `npm run build && npm run start`

---

### 📚 Related Resources

- **Tambo AI Documentation**: [https://docs.tambo.co](https://docs.tambo.co)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Alibaba Cloud DashScope**: [https://dashscope.aliyun.com](https://dashscope.aliyun.com)
- **Development Guide**: Check `CLAUDE.md` for AI-assisted development guide

---

### 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

### 📄 License

MIT License - See LICENSE file for details

---

### 🙏 Acknowledgments

- **Tambo AI** - Powerful AI generative UI framework
- **Next.js** - Excellent React full-stack framework
- **Alibaba Cloud** - DashScope image generation service
- **Tailwind CSS** - Modern CSS framework

---

<div align="center">

**🎊 Happy Lunar New Year! Wishing you all the best! 🎊**

Made with ❤️ for Lunar New Year 2026

</div>

---
---

## 中文

### ✨ 功能特色

#### 🧧 春节祝福语生成
- **多种风格**：传统、幽默、文艺、商务四种风格可选
- **个性化定制**：根据对象（家人、朋友、同事、客户）生成专属祝福
- **智能互动**：支持点赞/点踩反馈，AI 会根据你的喜好优化后续内容
- **一键操作**：快速复制分享

#### 😄 趣味表情包生成
- **创意方案**：AI 生成完整的表情包创意，包含画面描述、文案和设计要点
- **四种风格**：喜庆、搞笑、可爱、创意
- **实际图片生成**：集成阿里云通义万相，可生成真实表情包图片
- **智能评分**：5 星评分系统，帮助 AI 理解你的喜好
- **快速优化**：一键调整内容（更幽默、更简洁、更详细、换场景）

#### 🌍 国际化支持
- **中英双语**：完整的中英文界面切换
- **智能记忆**：自动保存用户语言偏好

---

### 🚀 快速开始

#### 1. 安装依赖

```bash
npm install
```

#### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
# Tambo AI API Key (必需)
# 获取地址: https://tambo.co
NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key

# 阿里云通义万相 API Key (可选，用于图片生成功能)
# 获取地址: https://bailian.console.aliyun.com/
DASHSCOPE_API_KEY=your_dashscope_api_key
```

#### 3. 启动开发服务器

```bash
npm run dev
```

#### 4. 访问应用

打开浏览器访问：[http://localhost:3000](http://localhost:3000)

---

### 📱 功能页面

#### 🏠 首页 (`/`)
- 应用介绍和功能特色展示
- 两个主要功能入口：祝福语生成器和表情包生成器
- API Key 配置检查

#### ✨ 祝福语生成器 (`/blessings`)
- 智能对话式生成春节祝福语
- 支持多种风格和对象定制
- 交互式祝福卡片，支持点赞/点踩反馈
- 一键复制分享

#### 😄 表情包生成器 (`/memes`)
- 创意表情包方案生成
- 支持生成实际图片（需配置 DASHSCOPE_API_KEY）
- 5 星评分系统
- 快速优化按钮（更幽默、更简洁等）
- 图片下载和分享

#### 💬 通用聊天 (`/chat`)
- Tambo AI 对话界面示例
- 展示 Tambo 框架的完整能力

#### 🎯 交互式组件演示 (`/interactables`)
- Tambo Interactable 组件功能展示

---

### 🛠️ 技术架构

#### 核心技术栈
- **框架**: Next.js 15.5.7 (App Router)
- **UI 库**: React 19.1.1
- **语言**: TypeScript 5
- **AI SDK**: @tambo-ai/react ^0.74.1
- **样式**: Tailwind CSS v4
- **数据验证**: Zod
- **富文本编辑**: TipTap
- **图标**: Lucide React
- **动画**: Framer Motion

#### AI 集成
- **Tambo AI**: 主 AI 对话和 UI 生成引擎
- **通义万相**: 图片生成服务（阿里云）

#### 关键特性
- **组件注册系统**: 在 `src/lib/tambo.ts` 中注册可被 AI 动态控制的 React 组件
- **工具系统**: AI 可调用的外部函数（如图片生成）
- **流式响应**: 实时流式更新 AI 生成的内容
- **交互式组件**: 使用 `withInteractable` HOC 实现组件与 AI 的双向交互

---

### 📂 项目结构

```
my-app/
├── src/
│   ├── app/                        # Next.js App Router 页面
│   │   ├── page.tsx                # 首页
│   │   ├── blessings/              # 祝福语生成器页面
│   │   ├── memes/                  # 表情包生成器页面
│   │   ├── chat/                   # 通用聊天页面
│   │   ├── interactables/          # 交互式组件演示
│   │   ├── api/                    # API 路由
│   │   │   ├── generate-image/     # 图片生成 API
│   │   │   └── proxy-image/        # 图片代理 API
│   │   └── layout.tsx              # 根布局（TamboProvider）
│   ├── components/
│   │   ├── tambo/                  # Tambo 相关组件
│   │   │   ├── blessing-card.tsx   # 祝福语卡片（数据定义）
│   │   │   ├── interactive-blessing-card.tsx  # 交互式祝福语卡片
│   │   │   ├── meme-card.tsx       # 表情包卡片（数据定义）
│   │   │   ├── interactive-meme-card.tsx      # 交互式表情包卡片
│   │   │   ├── generated-meme-image.tsx       # 生成图片展示组件
│   │   │   ├── graph.tsx           # 图表组件
│   │   │   ├── message*.tsx        # 消息相关组件
│   │   │   └── thread*.tsx         # 对话线程组件
│   │   ├── ui/                     # 通用 UI 组件
│   │   ├── ApiKeyCheck.tsx         # API Key 验证组件
│   │   └── LanguageSwitcher.tsx    # 语言切换器
│   ├── hooks/
│   │   └── useLanguage.ts          # 语言管理 Hook
│   ├── lib/
│   │   ├── tambo.ts                # 🔥 核心配置：组件和工具注册
│   │   ├── i18n.ts                 # 国际化配置
│   │   └── utils.ts                # 工具函数
│   ├── locales/
│   │   └── translations.ts         # 翻译文本
│   └── services/
│       ├── image-generation.ts     # 图片生成服务
│       └── population-stats.ts     # 示例数据服务
├── public/                         # 静态资源
├── .env.local                      # 环境变量（需自行创建）
├── package.json                    # 项目依赖
├── tsconfig.json                   # TypeScript 配置
├── tailwind.config.ts              # Tailwind 配置
├── CLAUDE.md                       # Claude AI 开发指南
└── README.md                       # 项目文档
```

---

### 🎯 核心概念

#### 1. Tambo 组件注册

在 `src/lib/tambo.ts` 中注册组件，使 AI 能够动态渲染它们：

```typescript
export const components: TamboComponent[] = [
  {
    name: "BlessingCard",
    description: "交互式春节祝福卡片组件...",
    component: InteractiveBlessingCard,
    propsSchema: blessingCardSchema, // Zod schema
  },
  // 更多组件...
];
```

#### 2. Tambo 工具注册

注册 AI 可调用的函数：

```typescript
export const tools: TamboTool[] = [
  {
    name: "generateMemeImage",
    description: "生成春节表情包图片...",
    tool: generateMemeImage,
    inputSchema: z.object({...}),
    outputSchema: z.object({...}),
  },
  // 更多工具...
];
```

#### 3. 交互式组件

使用 `withInteractable` HOC 创建可与 AI 双向通信的组件：

```typescript
export const InteractiveBlessingCard = withInteractable(
  BlessingCard,
  "BlessingCard"
);
```

用户操作（点赞、点踩、优化请求）会自动发送回 AI，帮助 AI 优化后续响应。

---

### 💡 使用示例

#### 生成祝福语

```
用户输入：生成一条给父母的传统祝福语
AI 响应：渲染 BlessingCard 组件，显示精美的祝福语卡片
用户操作：点击"👍 喜欢"按钮
AI 学习：记住用户喜好，生成更多类似风格的祝福语
```

#### 生成表情包

```
用户输入：生成一个抢红包的搞笑表情包
AI 响应：渲染 MemeCard 组件，显示创意方案
用户操作：
  1. 给 5 星评分
  2. 点击"生成图片"按钮
AI 调用：generateMemeImage 工具
AI 响应：渲染 GeneratedMemeImage 组件，显示实际图片
用户操作：下载或复制图片 URL
```

---

### 📋 开发命令

```bash
# 开发环境
npm run dev              # 启动开发服务器 (localhost:3000)

# 生产环境
npm run build            # 构建生产版本
npm run start            # 启动生产服务器

# 代码质量
npm run lint             # 运行 ESLint 检查
npm run lint:fix         # 自动修复 ESLint 问题

# Tambo 工具
npx tambo help           # 查看 Tambo CLI 帮助
npx tambo init           # 初始化 Tambo 项目
```

---

### 🔧 扩展指南

#### 添加新的 Tambo 组件

1. 在 `src/components/tambo/` 创建组件文件
2. 使用 Zod 定义 props schema
3. 在 `src/lib/tambo.ts` 注册组件
4. （可选）使用 `withInteractable` 创建交互式版本

#### 添加新的工具

1. 在 `src/services/` 实现工具函数
2. 定义 Zod input/output schema
3. 在 `src/lib/tambo.ts` 注册工具

#### 添加国际化文本

1. 在 `src/locales/translations.ts` 添加翻译键值
2. 在组件中使用 `useLanguage()` 和 `createTranslator()`

---

### 🚀 部署

#### Vercel（推荐）

1. 推送代码到 GitHub/GitLab
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量：
   - `NEXT_PUBLIC_TAMBO_API_KEY`
   - `DASHSCOPE_API_KEY`（可选）
4. 一键部署

#### 其他平台

支持任何支持 Next.js 的平台：
- **Netlify**: 支持 Next.js App Router
- **AWS Amplify**: 完整支持
- **自托管**: 使用 `npm run build && npm run start`

---

### 📚 相关资源

- **Tambo AI 文档**: [https://docs.tambo.co](https://docs.tambo.co)
- **Next.js 文档**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **阿里云通义万相**: [https://dashscope.aliyun.com](https://dashscope.aliyun.com)
- **开发指南**: 查看 `CLAUDE.md` 了解 AI 辅助开发指南

---

### 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

### 📄 许可证

MIT License - 详见 LICENSE 文件

---

### 🙏 致谢

- **Tambo AI** - 提供强大的 AI 生成式 UI 框架
- **Next.js** - 优秀的 React 全栈框架
- **阿里云** - 通义万相图片生成服务
- **Tailwind CSS** - 现代化的 CSS 框架

---

<div align="center">

**🎊 祝你新春快乐，万事如意！🎊**

Made with ❤️ for Lunar New Year 2026

</div>
