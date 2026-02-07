#!/usr/bin/env node
/**
 * 通义万相 API 连接测试脚本
 * 用于验证 DASHSCOPE_API_KEY 是否配置正确
 */

require('dotenv').config({ path: '.env.local' });

const API_KEY = process.env.DASHSCOPE_API_KEY;
const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';

console.log('🔍 通义万相 API 连接测试\n');
console.log('=' .repeat(50));

// 检查 API Key
if (!API_KEY) {
  console.error('❌ 错误: DASHSCOPE_API_KEY 未设置');
  console.log('\n解决方法:');
  console.log('1. 在 .env.local 中添加:');
  console.log('   DASHSCOPE_API_KEY=sk-your-key-here');
  console.log('2. 获取 API Key: https://bailian.console.aliyun.com/cn-beijing/?tab=model#/api-key');
  process.exit(1);
}

console.log('✅ API Key 已配置');
console.log(`📋 API Key 预览: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 5)}\n`);

// 测试 API 连接
async function testDashScope() {
  console.log('🔄 正在测试 API 连接...\n');

  try {
    // 创建测试任务
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'X-DashScope-Async': 'enable',
      },
      body: JSON.stringify({
        model: 'wanx-v1',
        input: {
          prompt: '测试：一个红色的春节灯笼',
        },
        parameters: {
          style: '<auto>',
          size: '1024*1024',
          n: 1,
        },
      }),
    });

    console.log(`📡 HTTP 状态码: ${response.status}`);

    const data = await response.json();

    if (!response.ok) {
      console.error('\n❌ API 调用失败:');
      console.error('   错误消息:', data.message || '未知错误');
      console.error('   错误代码:', data.code || 'N/A');
      console.error('   请求ID:', data.request_id || 'N/A');
      
      if (data.message?.includes('InvalidApiKey') || data.message?.includes('Unauthorized')) {
        console.log('\n💡 解决方法:');
        console.log('   1. 检查 API Key 是否完整（包括 sk- 前缀）');
        console.log('   2. 去控制台重新创建 API Key');
        console.log('   3. 确认账户已实名认证');
      } else if (data.message?.includes('InsufficientBalance')) {
        console.log('\n💡 解决方法:');
        console.log('   1. 访问 https://bailian.console.aliyun.com/');
        console.log('   2. 进入「账户管理」→「充值」');
        console.log('   3. 充值 ¥10-20 即可');
      }
      
      process.exit(1);
    }

    const taskId = data.output?.task_id;

    if (!taskId) {
      console.error('❌ 任务创建失败: 没有返回 Task ID');
      process.exit(1);
    }

    console.log(`✅ 任务创建成功`);
    console.log(`📋 Task ID: ${taskId}`);
    console.log(`\n⏳ 正在等待任务完成（最多等待 30 秒）...\n`);

    // 轮询任务状态
    let attempt = 0;
    const maxAttempts = 30;

    while (attempt < maxAttempts) {
      attempt++;
      await new Promise(resolve => setTimeout(resolve, 1000));

      const statusResponse = await fetch(
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
          },
        }
      );

      const statusData = await statusResponse.json();
      const taskStatus = statusData.output?.task_status;

      process.stdout.write(`\r🔄 轮询 ${attempt}/${maxAttempts}，状态: ${taskStatus || 'UNKNOWN'}   `);

      if (taskStatus === 'SUCCEEDED') {
        const imageUrl = statusData.output?.results?.[0]?.url;
        console.log('\n');
        console.log('=' .repeat(50));
        console.log('🎉 测试成功！');
        console.log('=' .repeat(50));
        console.log('\n✅ API 连接正常');
        console.log('✅ API Key 有效');
        console.log('✅ 账户余额充足');
        console.log('✅ 图片生成成功');
        console.log(`\n📸 图片 URL: ${imageUrl}`);
        console.log('\n⚠️  注意: 图片链接 24 小时后会失效');
        console.log('\n🚀 你现在可以开始使用图片生成功能了！');
        process.exit(0);
      } else if (taskStatus === 'FAILED') {
        const errorMessage = statusData.output?.message || '未知错误';
        console.log('\n');
        console.error('❌ 任务失败:', errorMessage);
        process.exit(1);
      }
    }

    console.log('\n');
    console.error('⏱️  超时: 任务未在 30 秒内完成');
    console.log('这可能是暂时的网络问题，但 API 连接本身是正常的');
    process.exit(1);

  } catch (error) {
    console.error('\n💥 测试失败:');
    console.error('   ', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 这可能是网络连接问题');
      console.log('   请检查你的网络连接');
    }
    
    process.exit(1);
  }
}

// 运行测试
testDashScope();
