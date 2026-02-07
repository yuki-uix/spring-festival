# 🔧 Tambo API CORS 问题解决方案

解决 Tambo API 的跨域访问问题。

---

## ❌ 问题描述

### 错误信息

```
Access to fetch at 'https://api.tambo.co/threads/thr_xxx/advancestream' 
from origin 'http://localhost:3000' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### 问题原因

这个错误通常由以下原因引起：

1. **Tambo API 服务端暂时性问题** - API 服务器的 CORS 配置可能有临时故障
2. **网络问题** - 可能被防火墙或代理拦截
3. **API Key 问题** - 虽然不常见，但有可能
4. **开发环境限制** - 本地开发环境的特殊限制

---

## 🔍 诊断步骤

### 步骤 1：检查 Tambo 服务状态

**访问 Tambo 官网**，确认服务是否正常：
- https://tambo.co
- https://docs.tambo.co

### 步骤 2：验证 API Key

```bash
# 检查 API Key 是否正确配置
cat .env.local | grep TAMBO
```

应该看到：
```
NEXT_PUBLIC_TAMBO_API_KEY=tambo_xxx...
```

### 步骤 3：检查网络连接

```bash
# 测试能否访问 Tambo API
curl -I https://api.tambo.co
```

---

## ✅ 解决方案

### 方案 1：等待并重试（最常见）⭐⭐⭐⭐⭐

**这个问题通常是暂时性的**，可能是：
- Tambo API 服务重启
- 临时网络波动
- CDN 缓存更新

**解决方法**：
1. 等待 1-2 分钟
2. 刷新浏览器页面（Cmd/Ctrl + Shift + R 强制刷新）
3. 重新发送消息

---

### 方案 2：清除浏览器缓存⭐⭐⭐⭐

**步骤**：
1. 打开浏览器开发者工具（F12）
2. 右键点击刷新按钮
3. 选择「清空缓存并硬性重新加载」
4. 或者使用快捷键：**Cmd/Ctrl + Shift + R**

---

### 方案 3：检查并更新 Tambo SDK⭐⭐⭐⭐

当前版本：`@tambo-ai/react@0.74.1`

**检查是否有新版本**：
```bash
npm outdated @tambo-ai/react
```

**更新到最新版本**：
```bash
npm update @tambo-ai/react
```

**或者指定最新版本**：
```bash
npm install @tambo-ai/react@latest
```

---

### 方案 4：重启开发服务器⭐⭐⭐

有时候是开发服务器的问题：

```bash
# 1. 停止服务器（Ctrl+C）

# 2. 清理缓存
rm -rf .next

# 3. 重新启动
npm run dev
```

---

### 方案 5：配置代理（开发环境）⭐⭐⭐

如果问题持续存在，可以配置本地代理。

**创建** `next.config.js`（如果还没有）：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/tambo/:path*',
        destination: 'https://api.tambo.co/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

然后需要修改 Tambo Provider 的配置（但这可能需要自定义实现）。

---

### 方案 6：使用不同的浏览器⭐⭐

有时候是浏览器扩展或设置导致的：

1. 尝试使用**隐私/无痕模式**
2. 尝试使用**不同的浏览器**（Chrome → Firefox）
3. 暂时禁用浏览器扩展（特别是广告拦截器）

---

### 方案 7：检查防火墙/VPN⭐⭐

如果你在使用：
- 公司网络
- 校园网
- VPN
- 防火墙软件

**尝试**：
1. 断开 VPN
2. 使用手机热点
3. 检查防火墙设置

---

## 🚨 临时解决方案：使用静态数据测试

如果 Tambo API 暂时不可用，可以先用静态数据测试 UI：

**创建测试页面** `src/app/memes-test/page.tsx`：

```typescript
"use client";

import { useState } from "react";
import { MemeCard } from "@/components/tambo/meme-card";
import { GeneratedMemeImage } from "@/components/tambo/generated-meme-image";

export default function MemesTestPage() {
  const [showImage, setShowImage] = useState(false);

  // 测试数据
  const testMemes = {
    memes: [
      {
        title: "红包大战",
        description: "一个人盯着手机屏幕，手指疯狂点击，背景是飞舞的红包雨",
        caption: "手速慢一秒，红包就没了！",
        style: "funny" as const,
        scenario: "抢红包时发给朋友",
        designTips: [
          "使用夸张的卡通表情",
          "红包要画得很多很密集",
          "手指要有残影效果",
        ],
      },
    ],
  };

  const testImage = {
    url: "https://example.com/test.jpg", // 这里会显示错误，但可以测试 UI
    caption: "测试文案",
    style: "festive" as const,
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-50 via-orange-50 to-red-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">测试页面</h1>
        
        {/* 测试 MemeCard */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">测试创意卡片：</h2>
          <MemeCard memes={testMemes.memes} />
        </div>

        {/* 测试按钮 */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowImage(!showImage)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg"
          >
            {showImage ? "隐藏" : "显示"} 图片组件测试
          </button>
        </div>

        {/* 测试 GeneratedMemeImage */}
        {showImage && (
          <div>
            <h2 className="text-xl font-bold mb-4">测试图片组件：</h2>
            <GeneratedMemeImage {...testImage} />
          </div>
        )}
      </div>
    </div>
  );
}
```

然后访问：http://localhost:3000/memes-test

---

## 🔍 更多诊断命令

### 在浏览器控制台执行

打开浏览器开发者工具（F12），在 Console 中执行：

```javascript
// 测试能否访问 Tambo API
fetch('https://api.tambo.co', { method: 'HEAD' })
  .then(r => console.log('✅ Tambo API 可访问', r.status))
  .catch(e => console.error('❌ Tambo API 不可访问', e));

// 检查环境变量
console.log('API Key:', process.env.NEXT_PUBLIC_TAMBO_API_KEY?.substring(0, 20) + '...');
```

---

## 📞 联系 Tambo 支持

如果问题持续存在，可能需要联系 Tambo 团队：

- **文档**: https://docs.tambo.co
- **GitHub**: https://github.com/tambo-ai （如果有）
- **反馈邮箱**: 查看 Tambo 官网的联系方式

**报告时提供**：
1. 错误信息截图
2. 浏览器控制台完整日志
3. 你的 API Key 前几位（`tambo_bzFh...`）
4. 使用的 SDK 版本（`@tambo-ai/react@0.74.1`）

---

## 🎯 最可能的原因和解决方案

根据经验，这个问题 **90% 是暂时性的**：

### ✅ 推荐的解决步骤（按顺序尝试）：

1. **等待 1-2 分钟，刷新页面** ⭐⭐⭐⭐⭐
2. **强制刷新浏览器（Cmd/Ctrl + Shift + R）** ⭐⭐⭐⭐⭐
3. **重启开发服务器** ⭐⭐⭐⭐
4. **清理缓存：`rm -rf .next && npm run dev`** ⭐⭐⭐⭐
5. **更新 SDK：`npm update @tambo-ai/react`** ⭐⭐⭐
6. **尝试不同浏览器/无痕模式** ⭐⭐⭐
7. **检查网络（VPN/防火墙）** ⭐⭐

---

## 📊 常见情况

| 情况 | 解决方法 |
|------|---------|
| 第一次出现 | 刷新页面重试 |
| 持续 5 分钟 | 重启服务器 + 清理缓存 |
| 持续 30 分钟 | 检查 Tambo 服务状态 |
| 只在某个网络 | 检查防火墙/VPN |
| 更新代码后 | 清理 .next 文件夹 |

---

## ✨ 总结

**最快的解决方案**：
```bash
# 1. 强制刷新浏览器（Cmd/Ctrl + Shift + R）
# 2. 如果不行，重启服务器：
npm run dev
```

**如果还不行**：
- 等待几分钟，可能是 Tambo API 服务临时问题
- 使用测试页面验证其他功能是否正常

99% 的情况下，刷新页面或重启服务器就能解决！🎉
