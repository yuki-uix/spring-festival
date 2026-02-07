# OpenAI DALL-E 3 集成设置指南

## ✅ 已完成的集成

恭喜！OpenAI DALL-E 3 图片生成功能已经成功集成到你的春节表情包生成器中。

---

## 📋 已创建的文件

### 1. **图片生成服务**
- 📄 `src/services/image-generation.ts`
  - 封装 OpenAI DALL-E 3 API 调用
  - 根据风格构建优化的提示词
  - 完善的错误处理

### 2. **图片展示组件**
- 📄 `src/components/tambo/generated-meme-image.tsx`
  - 展示生成的图片
  - 下载功能
  - 复制链接功能
  - 风格标签显示

### 3. **配置更新**
- 📄 `src/lib/tambo.ts`
  - 注册 `generateMemeImage` 工具
  - 注册 `GeneratedMemeImage` 组件
  - 详细的描述说明

### 4. **系统提示词更新**
- 📄 `src/app/memes/page.tsx`
  - 添加图片生成工作流程
  - 明确的使用说明
  - 示例对话

### 5. **依赖安装**
- ✅ 已安装 `openai` npm 包

---

## 🔑 配置 OpenAI API Key

### 步骤 1：获取 API Key

1. 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 登录或注册账户
3. 点击 "Create new secret key"
4. 复制生成的 API Key（以 `sk-` 开头）

### 步骤 2：配置环境变量

打开 `.env.local` 文件，将你的 API Key 填入：

```bash
# OpenAI API Key for DALL-E 3 image generation
OPENAI_API_KEY=sk-your-actual-api-key-here
```

**⚠️ 安全提示：**
- 不要提交 `.env.local` 到版本控制
- 不要在客户端代码中暴露 API Key
- 定期轮换 API Key

### 步骤 3：重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 重新启动
npm run dev
```

---

## 🎯 使用方法

### 用户使用流程

1. **生成创意**
   ```
   用户："生成一个抢红包的搞笑表情包"
   AI：展示 2-3 个创意方案（使用 MemeCard）
   ```

2. **生成图片**
   ```
   用户："生成第一个的图片" 或 "我要图片"
   AI：调用 DALL-E 3 生成图片（10-20秒）
   ```

3. **下载保存**
   ```
   用户点击"下载图片"按钮
   图片保存到本地
   ```

### AI 自动判断

AI 会根据用户的意图自动选择：
- **只要创意** → 使用 `MemeCard` 组件
- **要实际图片** → 调用 `generateMemeImage` 工具 + `GeneratedMemeImage` 组件

---

## 💰 成本说明

### DALL-E 3 定价

| 质量 | 尺寸 | 价格 |
|------|------|------|
| 标准 | 1024x1024 | $0.040/张 |
| 高清 | 1024x1024 | $0.080/张 |

**当前配置：**
- 质量：标准 (standard)
- 尺寸：1024x1024
- 成本：$0.040/张

**预算估算：**
- 生成 10 张 = $0.40
- 生成 100 张 = $4.00
- 生成 1000 张 = $40.00

---

## 🧪 测试步骤

### 1. 基础测试

启动应用后，访问表情包页面：

```
http://localhost:3000/memes
```

### 2. 测试创意生成

输入：
```
生成一个抢红包的搞笑表情包
```

期望结果：
- ✅ 显示 2-3 个创意方案（MemeCard）
- ✅ 每个方案包含标题、描述、文案、场景、设计要点
- ✅ 询问用户是否要生成图片

### 3. 测试图片生成

继续输入：
```
生成第一个的图片
```

期望结果：
- ✅ AI 告知正在生成（需要 10-20 秒）
- ✅ 显示生成进度或等待提示
- ✅ 生成完成后显示图片（GeneratedMemeImage 组件）
- ✅ 图片可以正常显示
- ✅ 下载按钮可用
- ✅ 复制链接按钮可用

### 4. 测试下载功能

点击"下载图片"按钮：
- ✅ 图片成功下载到本地
- ✅ 文件名格式：`春节表情包-时间戳.png`

---

## ⚠️ 常见问题

### Q1: 报错 "API key not found"

**原因：** 未配置或配置错误 OpenAI API Key

**解决：**
1. 检查 `.env.local` 文件
2. 确保 API Key 以 `sk-` 开头
3. 重启开发服务器

### Q2: 图片生成失败

**可能原因：**
- API Key 额度不足
- 内容违规（content_policy_violation）
- 网络问题
- 请求频率过高

**解决：**
1. 检查 OpenAI 账户余额
2. 修改创意内容，避免敏感词
3. 检查网络连接
4. 稍后重试

### Q3: 图片链接失效

**原因：** OpenAI 生成的图片链接 1 小时后会失效

**解决：**
- 提醒用户及时下载
- 考虑实现图片上传到自己的服务器

### Q4: 生成速度慢

**原因：** DALL-E 3 生成图片通常需要 10-20 秒

**解决：**
- 已在 AI 提示词中添加等待提示
- 考虑添加加载动画（可选）

### Q5: 成本控制

**建议：**
- 在系统提示词中要求 AI 确认用户真的需要图片
- 可以添加每日生成次数限制
- 实现用户认证和配额管理

---

## 🔧 高级配置

### 调整图片质量

在 `src/services/image-generation.ts` 中修改：

```typescript
const response = await openai.images.generate({
  model: 'dall-e-3',
  prompt: prompt,
  n: 1,
  size: '1024x1024',
  quality: 'hd', // 改为 'hd' 获得高清质量（成本翻倍）
  style: 'vivid', // 'vivid' 或 'natural'
});
```

### 调整图片尺寸

支持的尺寸：
- `1024x1024` (正方形，推荐)
- `1792x1024` (横向)
- `1024x1792` (竖向)

### 添加重试机制

```typescript
// 在 image-generation.ts 中添加
const MAX_RETRIES = 3;
let attempt = 0;

while (attempt < MAX_RETRIES) {
  try {
    const response = await openai.images.generate({...});
    return response;
  } catch (error) {
    attempt++;
    if (attempt >= MAX_RETRIES) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
  }
}
```

---

## 📊 监控和日志

当前已实现的日志：
- ✅ 生成开始时打印提示词
- ✅ 生成成功时打印图片 URL
- ✅ 生成失败时打印详细错误

查看日志：
```bash
# 在终端中查看开发服务器输出
npm run dev
```

---

## 🚀 生产环境部署

### 1. 环境变量配置

在部署平台（如 Vercel）配置：
```
OPENAI_API_KEY=sk-your-production-key
```

### 2. 安全考虑

- ✅ API Key 只在服务器端使用
- ✅ 使用环境变量，不暴露在客户端
- ✅ 实现了错误处理

### 3. 成本监控

建议：
- 在 OpenAI Dashboard 设置用量警报
- 实现使用日志和统计
- 考虑添加用户限额

---

## 📝 下一步优化建议

### 短期优化
- [ ] 添加加载动画/进度提示
- [ ] 实现图片预览和编辑功能
- [ ] 添加生成历史记录

### 中期优化
- [ ] 将生成的图片保存到自己的存储服务
- [ ] 实现图片缓存机制
- [ ] 添加用户配额管理

### 长期优化
- [ ] 支持批量生成
- [ ] 添加图片编辑工具
- [ ] 实现 AI 图片优化和调整

---

## ✅ 集成完成清单

- [x] 安装 OpenAI SDK
- [x] 创建图片生成服务
- [x] 创建图片展示组件
- [x] 注册 Tambo 工具
- [x] 注册 Tambo 组件
- [x] 更新系统提示词
- [x] 配置环境变量
- [x] 代码质量检查
- [x] 创建文档

---

## 🎉 开始使用！

现在你可以：

1. ✅ 配置你的 OpenAI API Key
2. ✅ 重启开发服务器
3. ✅ 访问 http://localhost:3000/memes
4. ✅ 测试图片生成功能

**祝你使用愉快！如有问题，随时查看这份文档。** 🎊
