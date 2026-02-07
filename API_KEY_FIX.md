# 🔧 API Key 配置问题修复

## ❌ 原始问题

```
Uncaught OpenAIError: Missing credentials. Please pass an `apiKey`, 
or set the `OPENAI_API_KEY` environment variable.
```

## 🔍 问题原因

在 Next.js 中，Tambo 的工具（tools）是在**客户端（浏览器）**执行的，但环境变量 `OPENAI_API_KEY` 只在**服务器端**可用。

### 为什么会这样？

1. **环境变量的可见性规则：**
   - `NEXT_PUBLIC_*` 前缀的变量 → 客户端和服务器端都可用
   - 没有前缀的变量（如 `OPENAI_API_KEY`）→ 只在服务器端可用

2. **Tambo 工具的执行位置：**
   - Tambo 的 tools 函数在客户端（浏览器）中被调用
   - 客户端无法访问 `process.env.OPENAI_API_KEY`
   - 导致 OpenAI SDK 初始化失败

## ✅ 解决方案

创建一个 **Next.js API 路由**，在服务器端调用 OpenAI API。

### 架构改变

**之前（错误）：**
```
客户端 Tambo Tool → 直接调用 OpenAI SDK → ❌ API Key 不可用
```

**现在（正确）：**
```
客户端 Tambo Tool → fetch('/api/generate-image') → 服务器端 API 路由 → OpenAI SDK → ✅ 成功
```

---

## 📦 已修复的文件

### 1. **新增：API 路由**
- 📄 `src/app/api/generate-image/route.ts`
  - 在服务器端初始化 OpenAI 客户端
  - 接收 POST 请求
  - 调用 DALL-E 3 API
  - 返回图片 URL

### 2. **修改：图片生成服务**
- 📄 `src/services/image-generation.ts`
  - 移除客户端的 OpenAI 初始化
  - 改为通过 fetch 调用 API 路由
  - 保持相同的函数签名（不影响其他代码）

---

## 🎯 修复后的工作流程

### 1. 用户请求生成图片
```typescript
// 在客户端
AI 调用: generateMemeImage({
  description: "抢红包",
  style: "funny",
  caption: "手速就是超能力"
})
```

### 2. 客户端发送请求
```typescript
// src/services/image-generation.ts
fetch('/api/generate-image', {
  method: 'POST',
  body: JSON.stringify(params)
})
```

### 3. 服务器端处理
```typescript
// src/app/api/generate-image/route.ts
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // ✅ 服务器端可以访问
});

const response = await openai.images.generate({...});
```

### 4. 返回结果
```typescript
return NextResponse.json({
  url: imageUrl,
  revisedPrompt: revisedPrompt
});
```

---

## 🔒 安全优势

这个修复不仅解决了问题，还提供了更好的安全性：

✅ **API Key 永远不会暴露给客户端**
- API Key 只存在于服务器端
- 客户端代码中看不到 API Key
- 无法通过浏览器开发者工具查看

✅ **可以添加额外的安全措施**
- 可以添加请求频率限制
- 可以添加用户认证
- 可以记录和监控 API 使用

✅ **符合 Next.js 最佳实践**
- 敏感操作在服务器端执行
- 客户端只负责发送请求和显示结果

---

## ✅ 验证修复

### 1. 检查文件
- ✅ `src/app/api/generate-image/route.ts` 已创建
- ✅ `src/services/image-generation.ts` 已更新
- ✅ 无 linter 错误

### 2. 测试步骤

1. **确保 API Key 配置正确**
   ```bash
   # 检查 .env.local
   OPENAI_API_KEY=sk-proj-...
   ```

2. **重启开发服务器**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   npm run dev
   ```

3. **访问表情包页面**
   ```
   http://localhost:3000/memes
   ```

4. **测试生成图片**
   ```
   输入："生成一个抢红包的表情包"
   等待创意显示
   输入："生成第一个的图片"
   ```

5. **检查控制台**
   - 服务器端控制台应该显示：
     ```
     正在生成图片，提示词: ...
     图片生成成功: https://...
     ```
   - 浏览器控制台应该没有错误

---

## 🐛 如果还有问题

### 问题 1: 仍然报错 "Missing credentials"

**可能原因：**
- 服务器没有重启
- API Key 配置错误

**解决方案：**
1. 停止并重启开发服务器
2. 检查 `.env.local` 中的 API Key
3. 确保 API Key 以 `sk-` 开头

### 问题 2: API 路由返回 500 错误

**检查：**
1. 查看服务器端控制台的错误信息
2. 验证 API Key 是否有效
3. 检查 OpenAI 账户余额

### 问题 3: 404 错误

**可能原因：**
- API 路由文件路径错误

**解决方案：**
- 确保文件在：`src/app/api/generate-image/route.ts`
- 确保文件名是 `route.ts` 不是 `route.tsx`

---

## 📝 技术细节

### Next.js API 路由规则

```
文件路径: src/app/api/generate-image/route.ts
URL: /api/generate-image
HTTP 方法: 由导出的函数名决定 (GET, POST, PUT 等)
```

### 环境变量访问规则

| 位置 | 可访问的环境变量 |
|------|-----------------|
| 客户端组件 | `NEXT_PUBLIC_*` |
| 服务器端组件 | 所有变量 |
| API 路由 | 所有变量 ✅ |
| Middleware | 所有变量 |

---

## 🎉 修复完成！

现在你的应用应该可以正常生成图片了：

1. ✅ API Key 安全地存储在服务器端
2. ✅ 客户端通过 API 路由调用
3. ✅ 没有安全风险
4. ✅ 符合最佳实践

**开始测试图片生成功能吧！** 🚀

---

**修复时间：** 2026-02-07  
**状态：** ✅ 已修复  
**影响：** 无需修改其他代码，API 保持兼容
