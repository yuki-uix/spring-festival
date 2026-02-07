#!/usr/bin/env node

/**
 * 诊断图片生成问题
 * 运行: node scripts/diagnose-image-gen.js
 */

const { config } = require('dotenv');
const path = require('path');

// 加载环境变量
config({ path: path.resolve(__dirname, '../.env.local') });

async function diagnose() {
  console.log('🔍 开始诊断图片生成配置...\n');

  // 1. 检查 OpenAI API Key
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1️⃣  检查 OpenAI API Key');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY 未设置');
    console.log('\n💡 解决方案：');
    console.log('   在 .env.local 文件中添加:');
    console.log('   OPENAI_API_KEY=sk-your-api-key-here\n');
    return false;
  }

  if (apiKey === 'your_openai_api_key_here') {
    console.error('❌ OPENAI_API_KEY 仍然是默认值');
    console.log('\n💡 解决方案：');
    console.log('   将 .env.local 中的 API Key 替换为真实的 OpenAI API Key');
    console.log('   获取地址: https://platform.openai.com/api-keys\n');
    return false;
  }

  if (!apiKey.startsWith('sk-')) {
    console.warn('⚠️  API Key 格式可能不正确（应以 sk- 或 sk-proj- 开头）');
  }

  console.log('✅ API Key 已配置');
  console.log(`   前缀: ${apiKey.substring(0, 15)}...`);
  console.log(`   长度: ${apiKey.length} 字符\n`);

  // 2. 测试 OpenAI 连接
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('2️⃣  测试 OpenAI API 连接');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey });

    console.log('🔄 正在调用 OpenAI API...');
    
    // 尝试列出模型
    const models = await openai.models.list();
    
    console.log('✅ API 连接成功！');
    console.log(`   可访问 ${models.data.length} 个模型\n`);

    // 检查 DALL-E 3
    const dalleModel = models.data.find(m => m.id === 'dall-e-3');
    if (dalleModel) {
      console.log('✅ DALL-E 3 模型可用');
    } else {
      console.log('⚠️  DALL-E 3 未在模型列表中（可能仍然可用）');
    }
    console.log();

  } catch (error) {
    console.error('❌ API 调用失败\n');
    console.error('   错误类型:', error.constructor?.name);
    console.error('   错误消息:', error.message);
    console.error('   错误代码:', error.code);
    console.error('   HTTP状态:', error.status);
    
    console.log('\n💡 可能的原因：');
    
    if (error.status === 401 || error.code === 'invalid_api_key') {
      console.log('   - API Key 无效或已过期');
      console.log('   - 请在 https://platform.openai.com/api-keys 检查你的密钥\n');
    } else if (error.status === 429 || error.code === 'rate_limit_exceeded') {
      console.log('   - 请求频率过高');
      console.log('   - 请稍后再试\n');
    } else if (error.code === 'insufficient_quota') {
      console.log('   - 账户余额不足');
      console.log('   - 请在 https://platform.openai.com/account/billing 充值\n');
    } else {
      console.log('   - 网络连接问题');
      console.log('   - OpenAI 服务暂时不可用\n');
    }
    
    return false;
  }

  // 3. 测试 API 路由
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('3️⃣  检查 API 路由');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const apiRoutePath = path.resolve(__dirname, '../src/app/api/generate-image/route.ts');
  const fs = require('fs');

  if (fs.existsSync(apiRoutePath)) {
    console.log('✅ API 路由文件存在');
    console.log(`   路径: ${apiRoutePath}\n`);
  } else {
    console.error('❌ API 路由文件不存在');
    console.log('\n💡 解决方案：');
    console.log('   文件应该位于: src/app/api/generate-image/route.ts\n');
    return false;
  }

  // 4. 总结
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ 诊断完成');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('🎉 所有配置正常！\n');
  console.log('📝 下一步：');
  console.log('   1. 确保开发服务器正在运行: npm run dev');
  console.log('   2. 访问: http://localhost:3000/memes');
  console.log('   3. 测试生成图片功能\n');

  console.log('🐛 如果仍有问题，请：');
  console.log('   1. 检查浏览器控制台的完整错误信息');
  console.log('   2. 检查服务器终端的日志输出');
  console.log('   3. 尝试直接访问: http://localhost:3000/api/generate-image\n');

  return true;
}

diagnose()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n💥 诊断过程出错:', error);
    process.exit(1);
  });
