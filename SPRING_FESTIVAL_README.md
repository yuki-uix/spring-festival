# 春节祝福语和表情包生成器

这是一个基于 Tambo AI 的春节主题应用，可以快速生成个性化的春节祝福语和有趣的表情包创意。

## 🎊 功能特色

### 1. 春节祝福语生成器
- **多种风格**：传统、幽默、文艺、商务
- **精准对象**：可针对家人、朋友、同事、客户等不同对象
- **一键操作**：支持快速复制和分享
- **智能生成**：基于 AI 技术生成独特的祝福语

### 2. 趣味表情包生成器
- **创意丰富**：喜庆、搞笑、可爱、创意等多种风格
- **详细方案**：包含创意描述、文案建议、设计要点
- **场景匹配**：提供具体的使用场景建议
- **便捷分享**：支持复制创意和文案

## 🚀 快速开始

1. **安装依赖**
```bash
npm install
```

2. **配置 API Key**
在 `.env.local` 文件中设置 Tambo API Key：
```
NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx                    # 首页（入口页面）
│   ├── blessings/
│   │   └── page.tsx               # 祝福语生成页面
│   └── memes/
│       └── page.tsx               # 表情包生成页面
├── components/
│   ├── tambo/
│   │   ├── blessing-card.tsx      # 祝福语展示组件
│   │   ├── meme-card.tsx          # 表情包展示组件
│   │   └── message-thread-full.tsx # 聊天界面组件
│   └── ApiKeyCheck.tsx            # API Key 验证组件
└── lib/
    └── tambo.ts                   # Tambo 组件和工具注册
```

## 🎨 页面说明

### 首页 (`/`)
- 展示两个主要功能入口
- 春节主题设计，红色和黄色渐变背景
- 功能特色展示

### 祝福语生成页面 (`/blessings`)
- AI 聊天界面，支持自然语言交互
- 系统提示词已预配置，专注于生成春节祝福语
- 支持多种风格和对象定制

### 表情包生成页面 (`/memes`)
- AI 聊天界面，支持创意描述
- 生成包含设计要点的完整表情包方案
- 提供文案建议和使用场景

## 🛠️ 技术栈

- **Next.js 15.4.1** - React 框架
- **React 19.1.0** - UI 库
- **Tambo AI SDK** - AI 集成
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Zod** - Schema 验证

## 📝 使用示例

### 生成祝福语
1. 访问 `/blessings` 页面
2. 输入需求，例如：
   - "生成一条给父母的传统祝福语"
   - "给朋友的幽默新年祝福"
   - "文艺风格的春节寄语"
3. AI 会生成多条祝福语供选择
4. 点击复制或分享按钮

### 生成表情包
1. 访问 `/memes` 页面
2. 描述需求，例如：
   - "生成一个关于抢红包的搞笑表情包"
   - "可爱风格的拜年表情包"
   - "春节团圆主题的创意表情包"
3. AI 会生成包含详细设计方案的表情包创意
4. 复制创意或文案用于制作

## 🎯 自定义开发

### 添加新的祝福语风格
在 `src/components/tambo/blessing-card.tsx` 中的 `styleConfig` 添加新风格配置。

### 添加新的表情包风格
在 `src/components/tambo/meme-card.tsx` 中的 `styleConfig` 添加新风格配置。

### 修改 AI 行为
编辑页面中的 `systemPrompt` 属性来调整 AI 的生成策略和风格。

## 📄 许可证

MIT

## 🙏 致谢

本项目基于 [Tambo AI](https://tambo.co) 构建。
