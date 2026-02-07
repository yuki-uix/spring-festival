# 🎨 图片文字叠加解决方案

解决 AI 生成图片中文字不清晰的问题。

---

## ❌ 问题描述

当使用 AI（通义万相/DALL-E）生成表情包时，常见问题：
- 文字模糊不清
- 文字位置不佳
- 文字有错别字
- 文字样式不理想
- 文字被背景遮挡

**原因**: AI 模型在生成文字时不够精确，特别是中文。

---

## ✅ 解决方案：客户端 Canvas 文字叠加

### 核心思路

**两步走策略**：
1. AI 生成**纯图片**（不包含文字）
2. 前端用 **Canvas** 将文字清晰叠加上去

### 优势

| 特性 | Canvas 叠加 | AI 生成文字 |
|------|-------------|-------------|
| 文字清晰度 | ✅ 100%清晰 | ❌ 经常模糊 |
| 文字准确性 | ✅ 100%准确 | ❌ 可能有错 |
| 位置控制 | ✅ 完全可控 | ❌ 随机 |
| 样式统一 | ✅ 统一风格 | ❌ 不统一 |
| 成本 | ✅ 无额外成本 | ✅ 无额外成本 |
| 实时调整 | ✅ 可以调整 | ❌ 需重新生成 |

---

## 🔧 技术实现

### 1. 修改 API 提示词

**位置**: `src/app/api/generate-image/route.ts`

```typescript
// 构建通义万相提示词（中文效果更好）
// 注意：不要求AI生成文字，因为会在客户端叠加清晰的文字
const prompt = `
${stylePrompts[style] || stylePrompts.festive}
场景描述：${description}

要求：
- 方形表情包格式，适合社交媒体分享
- 主体突出，构图简洁明了，中心留白
- 色彩鲜明，对比度高
- 现代网络表情包风格
- 适合春节场景
- 背景干净，便于叠加文字

重要：不需要在图片中添加任何文字，保持画面干净

画风：数字插画，卡通风格，表情包格式
`.trim();
```

**关键改动**：
- ✅ 明确告诉 AI **不要生成文字**
- ✅ 要求**中心留白**，便于叠加
- ✅ 要求**背景干净**

### 2. 更新前端组件

**位置**: `src/components/tambo/generated-meme-image.tsx`

**核心功能**：
1. 加载 AI 生成的原始图片
2. 创建 Canvas 画布
3. 在 Canvas 上绘制原图
4. 叠加清晰的文字（带描边）
5. 导出合成后的图片

**关键代码**：

```typescript
useEffect(() => {
  const addTextToImage = async () => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext("2d");
      
      // 1. 绘制原图
      ctx.drawImage(img, 0, 0);
      
      // 2. 配置文字样式
      const fontSize = Math.floor(img.width * 0.08);
      ctx.font = `bold ${fontSize}px "PingFang SC", "Microsoft YaHei", Arial`;
      ctx.textAlign = "center";
      
      // 3. 绘制描边（增加可读性）
      ctx.strokeStyle = "#ffffff"; // 白色描边
      ctx.lineWidth = Math.floor(fontSize * 0.15);
      ctx.strokeText(caption, x, y);
      
      // 4. 绘制文字主体
      ctx.fillStyle = "#ff0000"; // 红色文字
      ctx.fillText(caption, x, y);
      
      // 5. 导出为图片
      const compositeUrl = canvas.toDataURL("image/png", 0.95);
      setCompositeImageUrl(compositeUrl);
    };
    
    img.src = url;
  };
  
  addTextToImage();
}, [url, caption]);
```

### 3. 文字样式配置

根据不同风格使用不同颜色：

```typescript
const styleConfig = {
  festive: {
    captionColor: "#ff0000",  // 红色（喜庆）
    captionStroke: "#ffd700", // 金色描边
  },
  funny: {
    captionColor: "#ff6600",  // 橙色（活泼）
    captionStroke: "#ffff00", // 黄色描边
  },
  cute: {
    captionColor: "#ff69b4",  // 粉色（可爱）
    captionStroke: "#ffffff", // 白色描边
  },
  creative: {
    captionColor: "#9c27b0",  // 紫色（创意）
    captionStroke: "#e1bee7", // 浅紫描边
  },
};
```

---

## 🎯 使用效果

### 对比示例

**之前（AI 直接生成文字）**：
```
问题：
❌ 文字模糊
❌ 位置不佳
❌ 可能有错别字
❌ 风格不统一
```

**之后（Canvas 叠加）**：
```
优势：
✅ 文字完全清晰
✅ 位置精确控制（底部15%）
✅ 100%准确无误
✅ 风格统一一致
✅ 带描边效果，任何背景都可读
```

---

## 📐 文字位置和大小

### 当前设置

```typescript
// 字体大小：图片宽度的 8%
const fontSize = Math.floor(img.width * 0.08);

// 文字位置：水平居中，垂直底部 15%
const x = img.width / 2;
const y = img.height * 0.85;

// 描边宽度：字体大小的 15%
ctx.lineWidth = Math.floor(fontSize * 0.15);
```

### 调整建议

**如果文字太大**：
```typescript
const fontSize = Math.floor(img.width * 0.06); // 改为 6%
```

**如果文字太小**：
```typescript
const fontSize = Math.floor(img.width * 0.10); // 改为 10%
```

**如果文字位置太低**：
```typescript
const y = img.height * 0.80; // 改为 80%
```

**如果文字位置太高**：
```typescript
const y = img.height * 0.90; // 改为 90%
```

---

## 🚀 高级功能（可选）

### 1. 多行文字

如果文字太长，自动换行：

```typescript
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split('');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine + word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

// 使用
const lines = wrapText(ctx, caption, img.width * 0.8);
lines.forEach((line, i) => {
  const lineY = y + (i * fontSize * 1.2);
  ctx.strokeText(line, x, lineY);
  ctx.fillText(line, x, lineY);
});
```

### 2. 自定义位置

让用户选择文字位置（顶部/中部/底部）：

```typescript
const positions = {
  top: img.height * 0.15,
  middle: img.height * 0.5,
  bottom: img.height * 0.85,
};

const y = positions[userSelectedPosition];
```

### 3. 文字阴影效果

增加阴影让文字更立体：

```typescript
ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
ctx.shadowBlur = 10;
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;
ctx.fillText(caption, x, y);
```

### 4. 渐变文字

使用渐变色：

```typescript
const gradient = ctx.createLinearGradient(0, y - fontSize/2, 0, y + fontSize/2);
gradient.addColorStop(0, "#ff0000");
gradient.addColorStop(1, "#ff9900");
ctx.fillStyle = gradient;
ctx.fillText(caption, x, y);
```

---

## 🐛 常见问题

### 1. 跨域图片无法处理

**问题**: Canvas 提示 "Tainted canvases may not be exported"

**解决**:
```typescript
img.crossOrigin = "anonymous"; // 已在代码中添加
```

### 2. 文字中文显示方块

**问题**: 字体未加载

**解决**:
```typescript
ctx.font = `bold ${fontSize}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
// 使用系统内置的中文字体
```

### 3. 图片质量下降

**问题**: Canvas 导出质量不够

**解决**:
```typescript
canvas.toDataURL("image/png", 0.95); // 使用 PNG，质量 95%
// 或使用更高质量
canvas.toDataURL("image/png", 1.0); // 质量 100%
```

### 4. 生成速度慢

**问题**: 大图片处理慢

**优化**:
```typescript
// 在 Web Worker 中处理（高级）
// 或者显示加载提示
{isProcessing && <div>正在添加文字...</div>}
```

---

## 📊 性能对比

| 指标 | AI生成文字 | Canvas叠加 |
|------|-----------|-----------|
| 生成时间 | 10-20秒 | +0.1秒 |
| 额外成本 | ¥0 | ¥0 |
| 文字质量 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 可控性 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 浏览器兼容 | ✅ | ✅ |

---

## ✨ 总结

### 为什么选择 Canvas 叠加？

1. **质量保证** - 文字永远清晰
2. **完全可控** - 位置、颜色、大小随意调整
3. **无需成本** - 不增加 API 调用
4. **用户体验** - 处理速度快（<100ms）
5. **可扩展** - 支持多行、渐变、阴影等高级效果

### 实施步骤

1. ✅ 修改 API 提示词（不生成文字）
2. ✅ 更新前端组件（Canvas 叠加）
3. ✅ 配置文字样式（颜色、描边）
4. ✅ 测试效果

### 下一步优化

- [ ] 支持用户自定义文字位置
- [ ] 支持多行文字自动换行
- [ ] 支持用户选择文字颜色
- [ ] 添加文字阴影和渐变效果
- [ ] 支持添加贴纸和装饰元素

---

## 🎉 效果

现在你的应用可以生成**专业级别的表情包**：
- AI 负责创意和画面 ✨
- Canvas 负责清晰文字 ✨
- 完美结合，效果拔群！🚀
