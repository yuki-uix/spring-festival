#!/usr/bin/env node

/**
 * 测试 OpenAI API 配置
 * 运行: node scripts/test-openai.js
 */

const { config } = require('dotenv');
const path = require('path');

// 加载环境变量
config({ path: path.resolve(__dirname, '../.env.local') });

async function testOpenAI() {
  console.log('🔍 正在测试 OpenAI API 配置...\n');

  // 检查 API Key
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ 错误: OPENAI_API_KEY 未设置');
    console.log('\n请在 .env.local 文件中添加:');
    console.log('OPENAI_API_KEY=sk-your-api-key-here\n');
    process.exit(1);
  }

  if (apiKey === 'your_openai_api_key_here') {
    console.error('❌ 错误: OPENAI_API_KEY 仍然是默认值');
    console.log('\n请将 .env.local 中的 API Key 替换为真实的 OpenAI API Key');
    console.log('获取地址: https://platform.openai.com/api-keys\n');
    process.exit(1);
  }

  if (!apiKey.startsWith('sk-')) {
    console.warn('⚠️  警告: API Key 格式可能不正确（应以 sk- 开头）');
  }

  console.log('✅ API Key 已配置');
  console.log(`📝 Key 前缀: ${apiKey.substring(0, 10)}...`);
  console.log(`📏 Key 长度: ${apiKey.length} 字符\n`);

  // 尝试调用 API（需要安装 openai 包）
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey });

    console.log('🔄 正在测试 API 连接...');
    
    // 列出可用模型来测试连接
    const models = await openai.models.list();
    
    console.log('✅ API 连接成功！');
    console.log(`📊 可访问 ${models.data.length} 个模型\n`);

    // 检查 DALL-E 3 是否可用
    const dalleModel = models.data.find(m => m.id === 'dall-e-3');
    if (dalleModel) {
      console.log('✅ DALL-E 3 模型可用');
    } else {
      console.log('⚠️  DALL-E 3 模型未在列表中（但可能仍然可用）');
    }

    console.log('\n🎉 所有测试通过！你可以开始使用图片生成功能了。\n');
    
  } catch (error) {
    console.error('❌ API 调用失败:', error.message);
    
    if (error.status === 401) {
      console.log('\n💡 这通常意味着 API Key 无效或已过期');
      console.log('   请检查你的 API Key 是否正确\n');
    } else if (error.status === 429) {
      console.log('\n💡 请求过于频繁或账户余额不足');
      console.log('   请检查你的 OpenAI 账户状态\n');
    } else {
      console.log('\n💡 请检查网络连接和 API Key 配置\n');
    }
    
    process.exit(1);
  }
}

testOpenAI().catch(console.error);
