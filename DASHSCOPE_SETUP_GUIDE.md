# 🎨 通义万相（阿里云）集成指南

恭喜！你的应用已经成功迁移到**通义万相**（阿里云 DashScope）。

---

## ✅ 已完成的配置

### 1. API 路由已更新
`src/app/api/generate-image/route.ts` 已经从 OpenAI DALL-E 3 迁移到通义万相。

### 2. 无需额外依赖
使用原生的 `fetch` API 调用通义万相，无需安装任何第三方库。

### 3. 中文优化
提示词已针对中文场景优化，对春节元素理解更好。

---

## 🚀 快速开始

### 步骤 1：获取通义万相 API Key

#### 1. 访问阿里云百炼平台控制台
```
https://bailian.console.aliyun.com/cn-beijing/?tab=model#/api-key
```

#### 2. 登录/注册阿里云账号
- 如果没有账号，需要先注册
- 支持手机号注册
- 可能需要实名认证

#### 3. 创建 API Key

1. 进入控制台后，点击左侧菜单「API-KEY 管理」
2. 点击「创建新的 API-KEY」
3. 复制生成的 API Key（格式类似：`sk-xxxxxxxxxxxx`）

⚠️ **重要**：API Key 只会显示一次，请立即保存！

#### 4. 开通服务并充值

1. 在控制台中找到「通义万相」服务
2. 点击「开通服务」
3. 前往「账户管理」→「充值」
4. 建议充值 **¥10-20** 即可用很久（每张图约 ¥0.05）

---

### 步骤 2：配置环境变量

打开 `.env.local` 文件，找到这一行：

```bash
DASHSCOPE_API_KEY=your_dashscope_api_key_here
```

替换为你的真实 API Key：

```bash
DASHSCOPE_API_KEY=sk-your-actual-key-here
```

保存文件。

---

### 步骤 3：重启开发服务器

**必须重启服务器才能生效！**

```bash
# 1. 停止当前服务器（按 Ctrl+C）

# 2. 重新启动
npm run dev
```

---

### 步骤 4：测试图片生成

1. 访问 http://localhost:3000/memes（或 http://localhost:3001/memes）
2. 输入："生成一个抢红包的表情包"
3. AI 会给出创意，然后你说："生成第一个的图片"
4. 等待 5-10 秒，图片就生成好了！

---

## 📊 通义万相 vs OpenAI 对比

| 特性 | 通义万相 | OpenAI DALL-E 3 |
|------|---------|----------------|
| **国内访问** | ✅ 直接访问 | ❌ 需要翻墙 |
| **成本** | ¥0.05/张 | $0.04/张 (≈¥0.30) |
| **中文理解** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **生成速度** | 5-10秒 | 10-20秒 |
| **图片质量** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **春节元素** | 理解好 | 需要详细描述 |

**结论：性价比最高，国内最佳选择！**

---

## 💰 定价和成本

### 通义万相定价

- **wanx-v1 模型**: ¥0.05/张（1024x1024）
- **wanx2.6-t2i 模型**: ¥0.08/张（支持更多尺寸）

### 成本估算

| 使用量 | 成本 |
|-------|------|
| 测试 20 张 | ¥1 |
| 生成 100 张 | ¥5 |
| 生成 1000 张 | ¥50 |

**建议充值**: ¥10-20 足够开发和测试使用

---

## 🔧 技术细节

### API 调用流程

1. **创建任务**：POST 请求到通义万相 API
2. **获取 Task ID**：API 返回异步任务 ID
3. **轮询状态**：每隔 1 秒查询任务状态
4. **获取结果**：任务成功后返回图片 URL

### 超时设置

- 默认最长等待 **60 秒**
- 通常 5-10 秒内完成
- 如果超时会返回错误

### 图片有效期

⚠️ **重要**: 通义万相生成的图片 URL **24 小时后会失效**！

- 如果需要长期保存，请下载图片到本地
- 或者上传到你自己的服务器/OSS

---

## 🐛 常见问题

### 1. 报错：API Key 未配置

**原因**: 没有设置 `DASHSCOPE_API_KEY` 或没有重启服务器

**解决**:
```bash
# 1. 检查 .env.local 文件是否正确配置
cat .env.local | grep DASHSCOPE

# 2. 重启开发服务器
npm run dev
```

### 2. 报错：InvalidApiKey 或 Unauthorized

**原因**: API Key 格式错误或权限不足

**解决**:
1. 确认 API Key 格式正确（通常以 `sk-` 开头）
2. 在控制台检查 API Key 是否已启用通义万相服务
3. 访问 https://bailian.console.aliyun.com/cn-beijing/?tab=model#/api-key 重新创建 API Key

### 3. 报错：额度不足

**原因**: 账户余额不足

**解决**:
1. 访问 https://bailian.console.aliyun.com/
2. 进入「账户管理」→「充值」
3. 充值 ¥10-20

### 4. 图片生成超时

**原因**: 网络问题或服务器繁忙

**解决**:
- 重试一次
- 简化提示词
- 检查网络连接

### 5. 图片质量不满意

**解决**:
- 修改提示词，提供更详细的描述
- 尝试不同的风格（festive/funny/cute/creative）
- 在提示词中明确指定色彩、构图等要求

---

## 📚 更多资源

### 官方文档
- **通义万相控制台**: https://bailian.console.aliyun.com/cn-beijing/?tab=model#/api-key
- **API 文档**: https://help.aliyun.com/zh/model-studio/wan-image-generation-api-reference
- **价格说明**: https://help.aliyun.com/zh/model-studio/product-overview/billing-instructions

### 升级到更强模型

如果想要更高质量，可以升级到 `wanx2.6-t2i` 模型：

```typescript
// 在 src/app/api/generate-image/route.ts 中修改
body: JSON.stringify({
  model: 'wanx2.6-t2i', // 从 wanx-v1 升级到 2.6
  // ... 其他参数
}),
```

**注意**: 2.6 模型价格稍贵（¥0.08/张），但质量更好

---

## ✨ 下一步

1. **获取 API Key** (5 分钟)
2. **配置 `.env.local`** (1 分钟)
3. **重启服务器** (1 分钟)
4. **测试生成图片** (1 分钟)

**总共只需要 10 分钟！** 🚀

---

## 💡 提示

- 通义万相对**中文提示词**效果更好
- 春节、灯笼、鞭炮等**中国元素**理解准确
- 生成的图片**适合国内审美**
- **成本是 OpenAI 的 1/6**

开始享受通义万相的强大功能吧！🎨
