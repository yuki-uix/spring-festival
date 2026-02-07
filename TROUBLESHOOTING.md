# 🔧 图片生成故障排除指南

## ❌ 错误信息

```
Error in calling tool: Error: 图片生成失败: 图片生成失败，请重试
at Object.generateMemeImage [as getComponentContext]
```

## 🔍 可能的原因

这个错误表明 API 调用失败了，但具体原因被错误处理包装了。让我们逐步排查。

---

## 📋 排查步骤

### 步骤 1: 检查开发服务器端口

你的服务器现在运行在 **端口 3001**（不是 3000），因为 3000 被占用了。

**检查方法：**
```bash
# 查看终端输出，应该显示：
- Local: http://localhost:3001
```

**可能的问题：**
- 客户端可能还在调用 `http://localhost:3000/api/generate-image`（错误端口）

---

### 步骤 2: 运行诊断脚本

```bash
# 安装依赖（如果还没安装）
npm install dotenv

# 运行诊断
node scripts/diagnose-image-gen.js
```

这个脚本会检查：
- ✅ API Key 是否配置
- ✅ API Key 格式是否正确
- ✅ OpenAI API 是否可访问
- ✅ 账户余额是否充足
- ✅ API 路由文件是否存在

---

### 步骤 3: 查看详细日志

#### A. 查看浏览器控制台

打开浏览器开发者工具（F12），查看 Console 标签：

应该看到：
```
🎨 开始生成图片，参数: {...}
📡 API 响应状态: xxx
📦 API 响应数据: {...}
```

如果看到错误，记录完整的错误信息。

#### B. 查看服务器端控制台

在运行 `npm run dev` 的终端中应该看到：

成功时：
```
🔵 [API] 收到图片生成请求
✅ [API] API Key 已配置
📝 [API] 请求参数: {...}
🎨 [API] 开始调用 DALL-E 3...
✅ [API] DALL-E 3 调用成功
🎉 [API] 图片生成成功: https://...
```

失败时：
```
💥 [API] 图片生成失败
   错误类型: OpenAIError
   错误消息: ...
   错误代码: ...
```

---

### 步骤 4: 常见问题诊断

#### 问题 A: API Key 未配置或无效

**症状：**
```
OpenAI API Key 未配置
或
OpenAI API Key 无效或已过期
```

**解决方案：**
1. 检查 `.env.local` 文件
2. 确保有这一行：`OPENAI_API_KEY=sk-...`
3. 确保 API Key 有效（在 OpenAI Platform 检查）
4. 重启开发服务器

#### 问题 B: 账户余额不足

**症状：**
```
API 额度不足，请检查账户余额
或
insufficient_quota
```

**解决方案：**
1. 访问：https://platform.openai.com/account/billing
2. 检查账户余额
3. 如需要，添加付费方式并充值

#### 问题 C: 网络问题

**症状：**
```
fetch failed
或
ECONNREFUSED
```

**解决方案：**
1. 检查网络连接
2. 检查防火墙设置
3. 尝试使用 VPN

#### 问题 D: 端口问题

**症状：**
服务器在 3001，但客户端调用 3000

**解决方案：**
访问正确的端口：http://localhost:3001/memes

---

## 🔧 快速修复步骤

### 1. 停止所有服务器

```bash
# 找到占用端口的进程
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### 2. 重新启动

```bash
npm run dev
```

### 3. 检查端口

确认服务器运行在哪个端口（通常是 3000）

### 4. 访问正确的 URL

```
http://localhost:端口号/memes
```

---

## 🧪 手动测试 API 路由

使用 curl 或 Postman 测试：

```bash
curl -X POST http://localhost:3001/api/generate-image \
  -H "Content-Type: application/json" \
  -d '{
    "description": "一个人抢红包手速超快",
    "style": "funny",
    "caption": "手速就是超能力"
  }'
```

**期望响应：**
```json
{
  "url": "https://oaidalleapiprodscus...",
  "revisedPrompt": "..."
}
```

**错误响应示例：**
```json
{
  "error": "OpenAI API Key 无效或已过期",
  "details": "...",
  "code": "invalid_api_key"
}
```

---

## 📝 检查清单

请检查以下项目：

- [ ] `.env.local` 文件中有 `OPENAI_API_KEY=sk-...`
- [ ] API Key 不是默认值 `your_openai_api_key_here`
- [ ] API Key 在 OpenAI Platform 显示为有效
- [ ] OpenAI 账户有余额（至少 $5）
- [ ] 开发服务器正在运行
- [ ] 访问的是正确的端口
- [ ] 浏览器控制台没有其他错误
- [ ] 服务器控制台显示了详细日志

---

## 🆘 获取更多信息

### 查看完整的服务器日志

在你的终端中，应该能看到详细的错误信息，包括：
- 错误类型
- 错误消息
- 错误代码
- HTTP 状态码

### 查看浏览器网络请求

1. 打开浏览器开发者工具（F12）
2. 切换到 "Network" 标签
3. 触发图片生成
4. 找到 `/api/generate-image` 请求
5. 查看：
   - Status Code
   - Response（响应内容）
   - Preview（预览）

---

## 💡 最可能的原因

根据错误信息，最可能是以下之一：

### 1. API Key 问题（最常见）⭐
- API Key 未配置
- API Key 无效
- API Key 权限不足

**快速验证：**
```bash
node scripts/diagnose-image-gen.js
```

### 2. 账户余额问题
- 免费试用额度用完
- 付费账户余额不足

**检查：**
https://platform.openai.com/account/billing

### 3. 网络问题
- 无法连接到 OpenAI API
- 防火墙拦截

**测试：**
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer sk-your-api-key"
```

---

## 🎯 建议的调试流程

1. **运行诊断脚本**
   ```bash
   node scripts/diagnose-image-gen.js
   ```

2. **检查诊断结果**
   - 如果失败，按照提示修复

3. **重启服务器**
   ```bash
   npm run dev
   ```

4. **测试生成**
   - 访问正确的端口
   - 尝试生成图片
   - 查看两端的日志

5. **记录详细错误**
   - 浏览器控制台的完整输出
   - 服务器终端的完整输出

---

## 📞 需要更多帮助？

如果按照上述步骤仍然无法解决，请提供：

1. **诊断脚本输出**（`node scripts/diagnose-image-gen.js`）
2. **浏览器控制台的完整错误**（包括红色的错误堆栈）
3. **服务器终端的日志**（特别是 `[API]` 开头的行）
4. **API Key 的前缀**（例如：`sk-proj-...` 的前 15 个字符）

有了这些信息，我可以精确定位问题！

---

**创建时间：** 2026-02-07  
**状态：** 诊断工具已就绪
