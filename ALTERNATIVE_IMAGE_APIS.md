# 🎨 图片生成 API 替代方案

OpenAI 用不了？没问题！这里有多个优秀的替代方案。

---

## 🌟 推荐方案对比

| 方案 | 国内可用 | 成本 | 质量 | 速度 | 推荐度 |
|------|---------|------|------|------|--------|
| **通义万相（阿里云）** | ✅ | 低 | ⭐⭐⭐⭐ | 快 | ⭐⭐⭐⭐⭐ |
| **文心一格（百度）** | ✅ | 低 | ⭐⭐⭐⭐ | 快 | ⭐⭐⭐⭐ |
| **Replicate SDXL** | ❌ 需外网 | 很低 | ⭐⭐⭐⭐ | 中 | ⭐⭐⭐ |
| **本地生成** | ✅ | 免费 | ⭐⭐ | 极快 | ⭐⭐ |

---

## 🎯 方案 1：通义万相（阿里云）⭐⭐⭐⭐⭐

**最推荐！国内可用，质量好，速度快**

### 优点
- ✅ 国内直接访问，无需翻墙
- ✅ 价格便宜（比 OpenAI 低很多）
- ✅ 质量优秀，专门优化过中文
- ✅ API 文档完善，中文支持好
- ✅ 阿里云生态，稳定可靠

### 定价
- **通义万相 2.6**: 约 ¥0.05-0.10/张（$0.007-0.014）
- 比 OpenAI 便宜 **5-10 倍**！

### 实现代码

#### 1. 安装依赖
```bash
npm install @alicloud/dashscope
```

#### 2. 创建图片生成服务

```typescript
// src/services/image-generation.ts
import dashscope from '@alicloud/dashscope';

dashscope.api_key = process.env.DASHSCOPE_API_KEY || '';

export async function generateMemeImage(params: {
  description: string;
  style: 'festive' | 'funny' | 'cute' | 'creative';
  caption: string;
}) {
  const stylePrompts = {
    festive: '喜庆的春节风格，红色和金色主色调，灯笼、鞭炮、春联等元素',
    funny: '搞笑幽默的卡通风格，夸张表情，可爱搞笑',
    cute: '可爱萌系风格，Q版卡通，圆润温馨',
    creative: '创意独特风格，脑洞大开，视觉冲击强',
  };

  const prompt = `
${stylePrompts[params.style]}
场景描述：${params.description}
图片文字：${params.caption}

要求：
- 方形表情包格式
- 主体突出，构图简洁
- 色彩鲜明，适合春节
- 文字清晰可读
- 现代网络表情包风格
`;

  try {
    console.log('🎨 开始生成图片（通义万相）...');

    const response = await dashscope.ImageSynthesis.asyncCall({
      model: 'wanx-v1', // 或 'wanx2.6-t2i'
      input: {
        prompt: prompt,
      },
      parameters: {
        style: '<auto>',
        size: '1024*1024',
        n: 1,
      },
    });

    // 等待异步任务完成
    const taskId = response.output.task_id;
    let result;
    
    while (true) {
      result = await dashscope.ImageSynthesis.fetch({
        task_id: taskId,
      });
      
      if (result.output.task_status === 'SUCCEEDED') {
        break;
      } else if (result.output.task_status === 'FAILED') {
        throw new Error('图片生成失败');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const imageUrl = result.output.results[0].url;

    return {
      url: imageUrl,
      revisedPrompt: prompt,
    };
  } catch (error: any) {
    console.error('图片生成失败:', error);
    throw new Error(`通义万相生成失败: ${error.message}`);
  }
}
```

#### 3. 更新 API 路由

```typescript
// src/app/api/generate-image/route.ts
import dashscope from '@alicloud/dashscope';

dashscope.api_key = process.env.DASHSCOPE_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DASHSCOPE_API_KEY) {
      return NextResponse.json(
        { error: '通义万相 API Key 未配置' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { description, style, caption } = body;

    // ... 构建提示词（同上）

    const response = await dashscope.ImageSynthesis.asyncCall({
      model: 'wanx-v1',
      input: { prompt },
      parameters: {
        style: '<auto>',
        size: '1024*1024',
        n: 1,
      },
    });

    // 轮询获取结果
    const taskId = response.output.task_id;
    let result;
    
    for (let i = 0; i < 30; i++) { // 最多等待 30 秒
      result = await dashscope.ImageSynthesis.fetch({
        task_id: taskId,
      });
      
      if (result.output.task_status === 'SUCCEEDED') {
        break;
      } else if (result.output.task_status === 'FAILED') {
        throw new Error('图片生成失败');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const imageUrl = result.output.results[0].url;

    return NextResponse.json({ url: imageUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

#### 4. 配置环境变量

```bash
# .env.local
DASHSCOPE_API_KEY=your_dashscope_api_key_here
```

### 获取 API Key
1. 访问：https://bailian.console.aliyun.com/cn-beijing/?tab=model#/api-key
2. 登录阿里云账号
3. 创建 API Key
4. 复制到 `.env.local`

---

## 🎯 方案 2：文心一格（百度）⭐⭐⭐⭐

**国内可用，百度生态**

### 优点
- ✅ 国内访问，无需翻墙
- ✅ 中文优化好
- ✅ 百度生态集成

### 定价
- 价格与通义万相相近
- 有免费额度

### 实现
文心一格已经并入文心一言，需要通过千帆平台调用。

参考文档：https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html

---

## 🌐 方案 3：Replicate (SDXL) ⭐⭐⭐

**需要外网，但成本最低**

### 优点
- ✅ 成本极低（$0.006/张）
- ✅ 开源模型，可控性强
- ✅ 支持多种参数调整

### 缺点
- ❌ 需要外网访问
- 速度稍慢（6-10秒）

### 实现代码

```typescript
// 安装
npm install replicate

// 使用
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateMemeImage(params) {
  const output = await replicate.run(
    'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
    {
      input: {
        prompt: `${params.description}, ${params.caption}, Chinese New Year meme, cartoon style`,
        negative_prompt: 'ugly, blurry, low quality, text errors',
        width: 1024,
        height: 1024,
        num_outputs: 1,
      },
    }
  );

  return { url: output[0] };
}
```

### 获取 API Token
1. 访问：https://replicate.com/
2. 注册账号
3. 获取 API Token
4. 配置到 `.env.local`

---

## 💻 方案 4：本地生成（Canvas）⭐⭐

**完全免费，适合原型和展示**

### 优点
- ✅ 完全免费
- ✅ 无需外部 API
- ✅ 速度极快（毫秒级）
- ✅ 无网络依赖

### 缺点
- ❌ 质量较低（只是文字+背景）
- ❌ 不是真正的 AI 生成

### 实现代码

```typescript
// 安装
npm install html-to-image

// src/services/image-generation.ts
import { toPng } from 'html-to-image';

export async function generateMemeImage(params: {
  description: string;
  style: 'festive' | 'funny' | 'cute' | 'creative';
  caption: string;
}) {
  const styleColors = {
    festive: ['#ff0000', '#ffd700'],
    funny: ['#ffeb3b', '#ff9800'],
    cute: ['#ff69b4', '#ffb6c1'],
    creative: ['#9c27b0', '#e91e63'],
  };

  const [color1, color2] = styleColors[params.style];

  // 创建 DOM 元素
  const element = document.createElement('div');
  element.style.cssText = `
    width: 1024px;
    height: 1024px;
    background: linear-gradient(135deg, ${color1}, ${color2});
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    padding: 60px;
    box-sizing: border-box;
  `;

  // 添加表情符号
  const emoji = document.createElement('div');
  emoji.style.cssText = 'font-size: 200px; margin-bottom: 40px;';
  emoji.textContent = params.style === 'festive' ? '🧧' : 
                      params.style === 'funny' ? '😂' : 
                      params.style === 'cute' ? '🥰' : '💡';
  element.appendChild(emoji);

  // 添加文字
  const text = document.createElement('div');
  text.style.cssText = `
    font-size: 64px;
    font-weight: bold;
    color: white;
    text-align: center;
    text-shadow: 4px 4px 8px rgba(0,0,0,0.3);
    line-height: 1.4;
  `;
  text.textContent = params.caption;
  element.appendChild(text);

  document.body.appendChild(element);

  try {
    const dataUrl = await toPng(element, {
      width: 1024,
      height: 1024,
      quality: 0.95,
    });
    
    return { url: dataUrl };
  } finally {
    document.body.removeChild(element);
  }
}
```

---

## 📊 方案详细对比

### 成本对比

| 方案 | 每张成本 | 100张成本 | 1000张成本 |
|------|---------|----------|-----------|
| 通义万相 | ¥0.05-0.10 | ¥5-10 | ¥50-100 |
| 文心一格 | ¥0.05-0.15 | ¥5-15 | ¥50-150 |
| Replicate | $0.006 | $0.60 | $6.00 |
| 本地生成 | ¥0 | ¥0 | ¥0 |

### 质量对比

**通义万相 & 文心一格：**
- 专门优化中文提示词
- 对春节、中国元素理解好
- 生成的图片更符合国内审美

**Replicate SDXL：**
- 开源模型，质量稳定
- 英文提示词效果更好
- 需要调整参数才能生成中文场景

**本地生成：**
- 只是简单的文字+背景
- 适合快速原型
- 不适合正式使用

---

## 🏆 最终推荐：通义万相（阿里云）

### 为什么选择通义万相？

1. **国内可用** - 无需翻墙，访问稳定
2. **成本最优** - 比 OpenAI 便宜 5-10 倍
3. **中文优化** - 对春节主题理解更好
4. **质量优秀** - 与 DALL-E 3 相当
5. **API 简单** - 文档完善，易于集成

### 快速开始步骤

#### 1. 获取 API Key
```
访问: https://dashscope.console.aliyun.com/
登录阿里云账号
创建 API Key
```

#### 2. 安装依赖
```bash
npm install @alicloud/dashscope
```

#### 3. 配置环境变量
```bash
# .env.local
DASHSCOPE_API_KEY=sk-your-dashscope-key
```

#### 4. 我帮你实现代码

**你想让我现在帮你实现通义万相的集成吗？**

---

## 🚀 其他快速方案

### 如果你想立即测试（无需 API）

使用**本地生成方案**：
- 完全免费
- 无需配置
- 立即可用
- 适合演示和原型

我可以帮你实现一个简单但美观的本地生成方案，虽然质量不如 AI，但可以让功能先跑起来！

---

## 💡 你的选择

请告诉我你想用哪个方案：

1. **通义万相（阿里云）** - 推荐，性价比最高
2. **文心一格（百度）** - 备选，百度生态
3. **本地生成** - 免费临时方案，立即可用
4. **Replicate SDXL** - 如果你有外网

我会立即帮你实现！🚀
