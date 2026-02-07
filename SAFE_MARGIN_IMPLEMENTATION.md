# 表情包文字安全边距实现说明

## 📋 实现内容

已在 `src/components/tambo/generated-meme-image.tsx` 中实现了表情包的文字安全边距功能。

## ✨ 核心功能

### 1. 安全边距设置
- **左右各 9% 的安全边距**（在 8%-10% 范围内取平衡值）
- 文字渲染区域 = 图片宽度 - (9% × 2) = 图片宽度的 82%
- 确保文字不会超出表情包边界

### 2. 动态字体大小调整
- 初始字体大小：图片宽度的 8%
- 如果文字超出安全区域，自动缩小字体（每次减小 2px）
- 最小字体：12px（保证可读性）

### 3. 智能换行处理
- 当文字即使缩小字体后仍然太长时，自动换行
- 逐字符测量宽度，智能分割行
- 行高 = 字体大小 × 1.2（确保行间距合理）

### 4. 多行文字居中
- 计算总高度：行数 × 行高
- 从底部 85% 位置开始，向上偏移总高度的一半
- 每行都独立居中对齐

## 🔧 技术实现

```typescript
// 1. 计算安全边距
const safeMargin = img.width * 0.09; // 左右各9%
const maxTextWidth = img.width - (safeMargin * 2); // 文字最大宽度

// 2. 动态调整字体大小
let fontSize = Math.floor(img.width * 0.08);
let textWidth = ctx.measureText(caption).width;
while (textWidth > maxTextWidth && fontSize > 12) {
  fontSize -= 2;
  ctx.font = `bold ${fontSize}px ...`;
  textWidth = ctx.measureText(caption).width;
}

// 3. 智能换行
const lines: string[] = [];
if (textWidth > maxTextWidth) {
  // 逐字符测量，智能分行
  const chars = caption.split('');
  let currentLine = '';
  
  for (const char of chars) {
    const testLine = currentLine + char;
    const testWidth = ctx.measureText(testLine).width;
    
    if (testWidth > maxTextWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
} else {
  lines.push(caption);
}

// 4. 多行文字居中渲染
const lineHeight = fontSize * 1.2;
const totalHeight = lines.length * lineHeight;
const startY = img.height * 0.85 - (totalHeight / 2) + (lineHeight / 2);

lines.forEach((line, index) => {
  const y = startY + (index * lineHeight);
  // 绘制描边和填充...
});
```

## 📊 效果保证

✅ **文字不会超出边界**
- 左右各留 9% 安全边距
- 文字始终在安全区域内

✅ **自动适应长度**
- 短文字：正常显示，字体较大
- 中等长度：自动缩小字体
- 超长文字：自动换行

✅ **保持可读性**
- 最小字体 12px
- 带描边效果，增强对比度
- 多行文字行间距合理

✅ **美观居中**
- 水平居中对齐
- 垂直居中（底部 85% 位置）
- 多行文字整体居中

## 🎯 使用场景

适用于所有风格的春节表情包：
- 🎊 喜庆风格（festive）
- 😂 搞笑风格（funny）
- 🥰 可爱风格（cute）
- 💡 创意风格（creative）

## 📝 测试建议

1. **短文字测试**
   - "恭喜发财"
   - "新年快乐"
   - 预期：正常大小，单行显示

2. **中等长度测试**
   - "祝你新年快乐，万事如意！"
   - "龙腾虎跃迎新春，福满人间庆佳节"
   - 预期：字体适当缩小，单行显示

3. **超长文字测试**
   - "祝您新的一年里身体健康、工作顺利、家庭幸福、万事如意！"
   - 预期：自动换行，2-3 行显示

## ✅ 完成状态

- [x] 实现 8%-10% 安全边距（使用 9%）
- [x] 动态字体大小调整
- [x] 智能换行功能
- [x] 多行文字居中对齐
- [x] 保持最小可读字体
- [x] 更新提示信息

文字将始终保持在表情包宽度的安全范围内，不会超出边界！
