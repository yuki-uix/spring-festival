# 🛠️ 开发者指南

本指南面向希望理解、修改或扩展本项目的开发者。

---

## 📚 技术栈

### 核心框架
- **Next.js 15.4.1** - React 框架，使用 App Router
- **React 19.1.0** - UI 库
- **TypeScript** - 类型安全

### AI 集成
- **Tambo AI SDK** (`@tambo-ai/react`) - AI 聊天和组件生成
- **Zod** - Schema 验证和类型推导

### 样式
- **Tailwind CSS v4** - 原子化 CSS 框架
- **CSS 变量** - 自定义主题

### 工具
- **ESLint** - 代码检查
- **TypeScript** - 类型检查

---

## 📁 项目结构详解

```
my-app/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # 根布局（元数据配置）
│   │   ├── page.tsx                 # 首页
│   │   ├── globals.css              # 全局样式
│   │   ├── blessings/               # 祝福语功能
│   │   │   └── page.tsx            # 祝福语生成页面
│   │   ├── memes/                   # 表情包功能
│   │   │   └── page.tsx            # 表情包生成页面
│   │   ├── chat/                    # 原有聊天页面（保留）
│   │   └── interactables/           # 原有演示页面（保留）
│   │
│   ├── components/
│   │   ├── tambo/                   # Tambo 相关组件
│   │   │   ├── blessing-card.tsx   # 祝福语展示组件 ⭐
│   │   │   ├── meme-card.tsx       # 表情包展示组件 ⭐
│   │   │   ├── message-thread-full.tsx  # 聊天界面
│   │   │   └── ...                 # 其他聊天相关组件
│   │   ├── ui/                      # UI 组件
│   │   └── ApiKeyCheck.tsx          # API 密钥验证
│   │
│   ├── lib/
│   │   ├── tambo.ts                 # 组件和工具注册 ⭐⭐⭐
│   │   ├── thread-hooks.ts          # 线程管理 Hooks
│   │   └── utils.ts                 # 工具函数
│   │
│   └── services/
│       └── population-stats.ts      # 示例服务（原有）
│
├── public/                           # 静态资源
├── .env.local                        # 环境变量
├── package.json                      # 依赖配置
├── tsconfig.json                     # TypeScript 配置
├── tailwind.config.ts                # Tailwind 配置
└── next.config.ts                    # Next.js 配置
```

⭐ = 本次开发的核心文件

---

## 🔑 核心文件详解

### 1. `src/lib/tambo.ts` ⭐⭐⭐

**作用**：中央注册中心，所有 Tambo 组件和工具都在这里注册

```typescript
// 注册组件
export const components: TamboComponent[] = [
  {
    name: "BlessingCard",
    description: "展示春节祝福语的组件",
    component: BlessingCard,
    propsSchema: blessingCardSchema,
  },
  // ... 更多组件
];

// 注册工具
export const tools: TamboTool[] = [
  // 工具配置
];
```

**关键点**：
- 组件必须有 name、description、component、propsSchema
- AI 会根据 description 决定何时使用该组件
- propsSchema 定义了组件的 props 结构

### 2. `src/components/tambo/blessing-card.tsx`

**作用**：展示祝福语的 React 组件

```typescript
// 1. 定义 Schema
export const blessingCardSchema = z.object({
  blessings: z.array(
    z.object({
      title: z.string().describe("祝福语标题"),
      content: z.string().describe("祝福语内容"),
      style: z.enum([...]).describe("风格"),
      targetAudience: z.string().describe("适用对象"),
    })
  ),
});

// 2. 推导类型
type BlessingCardProps = z.infer<typeof blessingCardSchema>;

// 3. 实现组件
export const BlessingCard = ({ blessings }: BlessingCardProps) => {
  // 组件实现
};
```

**关键点**：
- Schema 使用 `.describe()` 给 AI 提供字段说明
- 使用 `z.infer` 自动推导 TypeScript 类型
- 组件必须 export，以便在 tambo.ts 中注册

### 3. `src/app/blessings/page.tsx`

**作用**：祝福语生成页面

```typescript
export default function BlessingsPage() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}
      components={components}
      tools={tools}
    >
      <MessageThreadFull
        threadId="blessings-thread"
        systemPrompt={`你是一个专业的春节祝福语生成助手...`}
        placeholder="输入你的需求..."
      />
    </TamboProvider>
  );
}
```

**关键点**：
- 每个使用 Tambo 的页面都需要 `TamboProvider`
- `threadId` 用于持久化聊天历史
- `systemPrompt` 定义 AI 的行为和能力
- 传入注册的 `components` 和 `tools`

---

## 🎯 如何添加新功能

### 添加新的祝福语风格

1. **修改 Schema**

在 `blessing-card.tsx` 中：

```typescript
export const blessingCardSchema = z.object({
  blessings: z.array(
    z.object({
      // ...
      style: z.enum([
        "traditional",
        "humorous",
        "literary",
        "business",
        "modern", // 👈 新增风格
      ]),
    })
  ),
});
```

2. **添加风格配置**

```typescript
const styleConfig = {
  // ...
  modern: {
    label: "现代风格",
    color: "teal",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    textColor: "text-teal-600",
    icon: "🌟",
  },
};
```

3. **更新系统提示词**

在 `blessings/page.tsx` 的 `systemPrompt` 中添加新风格说明。

### 添加新的 Tambo 组件

1. **创建组件文件**

`src/components/tambo/my-component.tsx`：

```typescript
import { z } from "zod";

// 1. 定义 Schema
export const myComponentSchema = z.object({
  // 定义 props
  title: z.string().describe("标题"),
  items: z.array(z.string()).describe("项目列表"),
});

// 2. 推导类型
type MyComponentProps = z.infer<typeof myComponentSchema>;

// 3. 实现组件
export const MyComponent = ({ title, items }: MyComponentProps) => {
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
```

2. **注册组件**

在 `src/lib/tambo.ts` 中：

```typescript
import { MyComponent, myComponentSchema } from "@/components/tambo/my-component";

export const components: TamboComponent[] = [
  // ...
  {
    name: "MyComponent",
    description: "描述这个组件的功能和使用场景，AI 会根据这个决定何时使用",
    component: MyComponent,
    propsSchema: myComponentSchema,
  },
];
```

3. **使用组件**

在任何使用 `TamboProvider` 的页面，AI 都可以自动调用这个组件。

### 添加新的工具（Tool）

工具是 AI 可以调用的函数，用于获取数据或执行操作。

1. **创建工具函数**

`src/services/my-service.ts`：

```typescript
export async function getSpringFestivalDates(input: { year: number }) {
  // 实现逻辑
  return {
    year: input.year,
    date: "2025-01-29",
    zodiac: "蛇",
  };
}
```

2. **注册工具**

在 `src/lib/tambo.ts` 中：

```typescript
import { getSpringFestivalDates } from "@/services/my-service";

export const tools: TamboTool[] = [
  // ...
  {
    name: "springFestivalDates",
    description: "获取指定年份的春节日期和生肖信息",
    tool: getSpringFestivalDates,
    inputSchema: z.object({
      year: z.number().describe("年份"),
    }),
    outputSchema: z.object({
      year: z.number(),
      date: z.string(),
      zodiac: z.string(),
    }),
  },
];
```

3. **AI 自动调用**

当用户问"2026年春节是哪天？"，AI 会自动调用这个工具。

### 添加新页面

1. **创建页面文件**

`src/app/new-feature/page.tsx`：

```typescript
"use client";

import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";

export default function NewFeaturePage() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}
      components={components}
      tools={tools}
    >
      <div>
        <MessageThreadFull
          threadId="new-feature-thread"
          systemPrompt={`你是一个...助手`}
          placeholder="输入..."
        />
      </div>
    </TamboProvider>
  );
}
```

2. **添加导航**

在首页或其他页面添加链接：

```tsx
<Link href="/new-feature">新功能</Link>
```

---

## 🔧 开发工作流

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问
# http://localhost:3000
```

### 代码检查

```bash
# 运行 ESLint
npm run lint

# 自动修复
npm run lint:fix
```

### 构建生产版本

```bash
npm run build
npm run start
```

---

## 🐛 调试技巧

### 1. 查看 AI 生成的组件

打开浏览器开发者工具，在 Console 可以看到 Tambo 的日志。

### 2. Schema 验证错误

如果 AI 传递的 props 不符合 Schema，Zod 会抛出详细错误。查看控制台输出。

### 3. 组件未被 AI 调用

检查：
- 组件是否在 `tambo.ts` 中正确注册
- `description` 是否清楚描述了使用场景
- `systemPrompt` 是否提到了这个组件

### 4. 样式问题

- 使用浏览器的元素检查器查看实际应用的 Tailwind 类
- 确保使用 Tailwind CSS v4 语法
- 检查是否有 CSS 冲突

---

## 📦 依赖管理

### 添加新依赖

```bash
npm install package-name
```

### 重要依赖说明

- `@tambo-ai/react`: Tambo AI React SDK
- `@tambo-ai/typescript-sdk`: Tambo AI TypeScript SDK
- `zod`: Schema 验证
- `recharts`: 图表库（原有示例使用）
- `lucide-react`: 图标库

---

## 🔐 环境变量

在 `.env.local` 中配置：

```bash
# Tambo API Key（必需）
NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
```

**注意**：
- `NEXT_PUBLIC_` 前缀使变量在客户端可用
- 不要将 `.env.local` 提交到版本控制

---

## 🚀 部署

### Vercel（推荐）

1. 推送代码到 Git 仓库
2. 在 Vercel 导入项目
3. 配置环境变量 `NEXT_PUBLIC_TAMBO_API_KEY`
4. 部署

### 其他平台

确保平台支持：
- Node.js 18+
- Next.js 15
- 环境变量配置

---

## 📝 最佳实践

### 1. 组件设计

- **单一职责**：每个组件只做一件事
- **类型安全**：使用 Zod + TypeScript
- **可复用**：考虑组件的通用性
- **良好描述**：在 Schema 中使用 `.describe()`

### 2. Schema 设计

```typescript
// ✅ 好的 Schema
z.object({
  title: z.string().describe("祝福语标题"),
  style: z.enum(["traditional", "modern"]).describe("风格：传统或现代"),
});

// ❌ 不好的 Schema
z.object({
  title: z.string(), // 缺少描述
  style: z.string(), // 应该用 enum
});
```

### 3. 系统提示词

- **清晰**：明确 AI 的角色和能力
- **具体**：给出具体的输出格式要求
- **示例**：提供使用示例
- **限制**：说明不应该做什么

### 4. 代码组织

- 相关文件放在一起
- 使用有意义的文件名
- 添加注释说明复杂逻辑
- 保持一致的代码风格

---

## 🔍 常见问题

### Q: 如何让 AI 使用我的组件？

A: 
1. 确保组件在 `tambo.ts` 中注册
2. 写好 `description`，描述清楚使用场景
3. 在 `systemPrompt` 中提示 AI 可以使用这个组件

### Q: Schema 验证失败怎么办？

A: 
1. 查看控制台错误信息
2. 检查 AI 返回的数据结构
3. 调整 Schema 或提示词

### Q: 如何自定义主题？

A: 
1. 修改 Tailwind 配置
2. 使用 CSS 变量
3. 调整组件的颜色配置

### Q: 如何优化性能？

A: 
1. 使用 React.memo 缓存组件
2. 合理使用 useState 和 useEffect
3. 避免不必要的重渲染

---

## 📚 参考资源

- [Tambo AI 文档](https://docs.tambo.co)
- [Next.js 文档](https://nextjs.org/docs)
- [Zod 文档](https://zod.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

## 🤝 贡献指南

如果你想贡献代码：

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 创建 Pull Request

确保：
- 代码通过 ESLint 检查
- 添加必要的注释
- 更新相关文档

---

**最后更新**：2026年2月7日
**版本**：1.0.0
**维护者**：开发团队
