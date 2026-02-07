# 春节表情包生成器 - 图片生成集成方案

## 📋 需求分析

在表情包对话栏中添加图片生成功能，让用户可以：
1. 通过 AI 对话生成表情包创意
2. 将创意直接转换为图片
3. 下载和分享生成的图片

---

## 🔍 Tambo AI 能力调研

### ✅ Tambo 支持的图片功能

根据对 `@tambo-ai/react` 的检索，Tambo **原生支持图片输入**（用户上传图片给 AI 分析），但**不直接支持图片生成**。

**Tambo 提供的图片相关功能：**
- ✅ `useMessageImages()` - 管理用户上传的图片
- ✅ `addImage()` / `addImages()` - 添加图片到消息
- ✅ `MessageInputFileButton` - 文件上传按钮组件
- ✅ 图片预览和管理（`StagedImage` 接口）
- ❌ **不支持 AI 生成图片**

### 💡 解决方案

由于 Tambo 不直接支持图片生成，我们需要集成第三方图片生成 API，有以下几个方案：

---

## 🎯 推荐方案

### 方案 1：使用 OpenAI DALL-E 3（推荐）⭐

**优点：**
- 质量高，生成效果好
- API 稳定，文档完善
- 支持中文提示词
- 可以与 Tambo 无缝集成

**缺点：**
- 需要 OpenAI API Key
- 按次数收费（约 $0.04-0.08/张）

**实现步骤：**

#### 1. 创建图片生成工具

```typescript
// src/services/image-generation.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateMemeImage(params: {
  description: string;
  style: 'festive' | 'funny' | 'cute' | 'creative';
  caption: string;
}) {
  // 构建详细的提示词
  const stylePrompts = {
    festive: '喜庆的春节风格，使用红色和金色，充满节日氛围',
    funny: '搞笑幽默风格，夸张的表情和动作',
    cute: '可爱萌系风格，卡通形象，温馨治愈',
    creative: '创意独特风格，脑洞大开，与众不同',
  };

  const prompt = `
创建一个春节表情包图片：
风格：${stylePrompts[params.style]}
内容：${params.description}
文字：${params.caption}

要求：
- 图片尺寸适合表情包（方形）
- 主体突出，构图简洁
- 色彩鲜明，适合春节主题
- 包含提供的文字作为图片文案
`;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    });

    return {
      url: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
    };
  } catch (error) {
    console.error('图片生成失败:', error);
    throw new Error('图片生成失败，请重试');
  }
}
```

#### 2. 注册为 Tambo Tool

```typescript
// src/lib/tambo.ts
import { generateMemeImage } from '@/services/image-generation';

export const tools: TamboTool[] = [
  // ... 其他工具
  {
    name: 'generateMemeImage',
    description: '生成春节表情包图片。当用户要求生成实际的图片时使用此工具。',
    tool: generateMemeImage,
    inputSchema: z.object({
      description: z.string().describe('表情包的创意描述'),
      style: z
        .enum(['festive', 'funny', 'cute', 'creative'])
        .describe('表情包风格'),
      caption: z.string().describe('表情包上的文案'),
    }),
    outputSchema: z.object({
      url: z.string().describe('生成的图片 URL'),
      revisedPrompt: z.string().optional().describe('AI 优化后的提示词'),
    }),
  },
];
```

#### 3. 创建图片展示组件

```typescript
// src/components/tambo/generated-meme-image.tsx
'use client';

import { z } from 'zod';
import { useState } from 'react';

export const generatedMemeImageSchema = z.object({
  url: z.string().describe('图片 URL'),
  caption: z.string().describe('图片文案'),
  style: z
    .enum(['festive', 'funny', 'cute', 'creative'])
    .describe('图片风格'),
});

type GeneratedMemeImageProps = z.infer<typeof generatedMemeImageSchema>;

export const GeneratedMemeImage = ({
  url,
  caption,
  style,
}: GeneratedMemeImageProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `春节表情包-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('下载失败:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          ✨ 表情包已生成！
        </h3>
        <p className="text-sm text-gray-600">文案：{caption}</p>
      </div>

      {/* 图片展示 */}
      <div className="relative bg-gray-100 rounded-xl overflow-hidden mb-4">
        <img
          src={url}
          alt={caption}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          {isDownloading ? '下载中...' : '💾 下载图片'}
        </button>
        <button
          onClick={handleCopy}
          className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
        >
          🔗 复制链接
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        ⚠️ 图片链接在 1 小时后会失效，请及时下载保存
      </p>
    </div>
  );
};
```

#### 4. 注册图片展示组件

```typescript
// src/lib/tambo.ts
import {
  GeneratedMemeImage,
  generatedMemeImageSchema,
} from '@/components/tambo/generated-meme-image';

export const components: TamboComponent[] = [
  // ... 其他组件
  {
    name: 'GeneratedMemeImage',
    description: '展示生成的表情包图片，包含下载和分享功能',
    component: GeneratedMemeImage,
    propsSchema: generatedMemeImageSchema,
  },
];
```

#### 5. 更新系统提示词

```typescript
// src/app/memes/page.tsx
const MEMES_SYSTEM_PROMPT = `你是一个专业的春节表情包创意生成助手...

**功能增强：图片生成**
当用户明确要求生成实际的图片时，使用以下流程：

1. 首先使用 MemeCard 组件展示创意方案
2. 询问用户是否要生成图片
3. 如果用户确认，调用 generateMemeImage 工具生成图片
4. 使用 GeneratedMemeImage 组件展示生成的图片

示例对话：
用户："生成一个抢红包的表情包"
AI：[展示 MemeCard 创意] "我已经为您设计了表情包创意。是否需要我生成实际的图片？"
用户："是的，生成图片"
AI：[调用 generateMemeImage 工具，然后展示 GeneratedMemeImage 组件]

注意：
- 只有在用户明确要求时才生成图片
- 生成图片需要一定时间，告知用户稍等
- 图片生成失败时给出友好提示
`;
```

#### 6. 配置环境变量

```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here
```

---

### 方案 2：使用 Stability AI（备选）

如果希望使用开源模型或降低成本：

```typescript
// 使用 Stability AI 的 SDXL
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateMemeImage(params) {
  const output = await replicate.run(
    'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    {
      input: {
        prompt: `${params.description}, ${params.caption}, Chinese New Year meme style`,
        negative_prompt: 'ugly, blurry, low quality',
      },
    }
  );

  return { url: output[0] };
}
```

**优点：**
- 成本更低
- 支持更多定制选项

**缺点：**
- 生成速度较慢
- 中文支持不如 OpenAI

---

### 方案 3：本地生成（适合展示）

如果只是演示或原型，可以使用前端库生成简单图片：

```typescript
// 使用 html-to-image 或 canvas 生成简单表情包
import { toPng } from 'html-to-image';

export async function generateSimpleMeme(caption: string, style: string) {
  // 创建 DOM 元素
  const element = document.createElement('div');
  element.style.cssText = `
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, #ff6b6b, #ffd93d);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    color: white;
    text-align: center;
    padding: 20px;
  `;
  element.textContent = caption;
  document.body.appendChild(element);

  try {
    const dataUrl = await toPng(element);
    return { url: dataUrl };
  } finally {
    document.body.removeChild(element);
  }
}
```

---

## 📊 方案对比

| 方案 | 质量 | 成本 | 速度 | 复杂度 | 推荐度 |
|------|------|------|------|--------|--------|
| OpenAI DALL-E 3 | ⭐⭐⭐⭐⭐ | 中 | 快 | 低 | ⭐⭐⭐⭐⭐ |
| Stability AI | ⭐⭐⭐⭐ | 低 | 慢 | 中 | ⭐⭐⭐⭐ |
| 本地生成 | ⭐⭐ | 免费 | 极快 | 低 | ⭐⭐⭐ |

---

## 🚀 实施步骤总结

### 快速开始（推荐 OpenAI 方案）

1. **安装依赖**
   ```bash
   npm install openai
   ```

2. **创建文件**
   - `src/services/image-generation.ts` - 图片生成服务
   - `src/components/tambo/generated-meme-image.tsx` - 图片展示组件

3. **注册工具和组件**
   - 在 `src/lib/tambo.ts` 中注册
   - 更新 `src/app/memes/page.tsx` 系统提示词

4. **配置 API Key**
   - 在 `.env.local` 添加 `OPENAI_API_KEY`

5. **测试**
   - 启动应用，进入表情包页面
   - 输入："生成一个抢红包的搞笑表情包图片"
   - 验证图片生成和下载功能

---

## 💰 成本估算

**OpenAI DALL-E 3 定价：**
- 标准质量 (1024x1024): $0.040/张
- 高清质量 (1024x1024): $0.080/张

**预估：**
- 100 张图片 ≈ $4-8
- 适合原型和中小规模使用

---

## ⚠️ 注意事项

1. **API Key 安全**
   - 不要在前端暴露 API Key
   - 使用服务器端 API 路由

2. **错误处理**
   - 添加重试机制
   - 显示友好的错误提示

3. **用户体验**
   - 生成前告知用户需要等待
   - 添加加载动画
   - 图片生成失败时提供替代方案

4. **内容审核**
   - OpenAI 有内容审核机制
   - 不合适的内容会被拒绝

---

## 📝 下一步

选择方案后，我可以帮你：
1. ✅ 实现完整的代码
2. ✅ 集成到现有系统
3. ✅ 添加错误处理和优化
4. ✅ 测试和调试

**建议先从 OpenAI DALL-E 3 方案开始，因为它最容易实现且效果最好。**
