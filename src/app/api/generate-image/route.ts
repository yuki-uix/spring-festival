import { NextRequest, NextResponse } from 'next/server';

/**
 * 阿里云通义万相图片生成 API
 * 文档：https://help.aliyun.com/zh/model-studio/wan-image-generation-api-reference
 */

// 通义万相 API 配置
const DASHSCOPE_API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 [API] 收到图片生成请求（通义万相）');

    // 验证 API Key
    if (!process.env.DASHSCOPE_API_KEY) {
      console.error('❌ [API] 通义万相 API Key 未配置');
      return NextResponse.json(
        { error: '通义万相 API Key 未配置，请在 .env.local 中设置 DASHSCOPE_API_KEY' },
        { status: 500 }
      );
    }

    console.log('✅ [API] API Key 已配置');

    // 解析请求体
    const body = await request.json();
    const { description, style, caption } = body;

    console.log('📝 [API] 请求参数:', { description, style, caption });

    // 验证参数
    if (!description || !style || !caption) {
      console.error('❌ [API] 缺少必需参数');
      return NextResponse.json(
        { error: '缺少必需参数: description, style, caption' },
        { status: 400 }
      );
    }

    // 根据风格构建提示词（通义万相对中文优化更好）
    const stylePrompts: Record<string, string> = {
      festive: '喜庆的春节风格，红色和金色主色调，灯笼、鞭炮、春联、烟花等传统元素，充满节日氛围',
      funny: '搞笑幽默的卡通风格，夸张的表情和动作，可爱搞笑，让人会心一笑',
      cute: '可爱萌系风格，Q版卡通人物或动物，圆润线条，温馨治愈的色彩，柔和的画面',
      creative: '创意独特风格，脑洞大开的构图，视觉冲击力强，与众不同的艺术表现',
    };

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

    console.log('🎨 [API] 开始调用通义万相...');
    console.log('📋 [API] 提示词:', prompt);

    // 调用通义万相 API（同步方式）
    const apiResponse = await fetch(DASHSCOPE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
        'X-DashScope-Async': 'enable', // 启用异步模式
      },
      body: JSON.stringify({
        model: 'wanx-v1', // 通义万相模型
        input: {
          prompt: prompt,
        },
        parameters: {
          style: '<auto>', // 自动选择风格
          size: '1024*1024', // 方形尺寸
          n: 1, // 生成 1 张图片
        },
      }),
    });

    console.log('📡 [API] 通义万相响应状态:', apiResponse.status);

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error('❌ [API] 通义万相返回错误:', errorData);
      throw new Error(errorData.message || '图片生成失败');
    }

    const responseData = await apiResponse.json();
    console.log('📦 [API] 通义万相响应数据:', responseData);

    // 通义万相使用异步模式，需要轮询获取结果
    const taskId = responseData.output?.task_id;

    if (!taskId) {
      console.error('❌ [API] 没有获取到任务 ID');
      throw new Error('任务创建失败');
    }

    console.log('🔄 [API] 任务已创建，Task ID:', taskId);
    console.log('⏳ [API] 开始轮询任务状态...');

    // 轮询获取结果（最多等待 60 秒）
    const maxAttempts = 60;
    let attempt = 0;
    let imageUrl: string | null = null;

    while (attempt < maxAttempts) {
      attempt++;
      
      // 等待 1 秒后查询
      await new Promise(resolve => setTimeout(resolve, 1000));

      const statusResponse = await fetch(
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          },
        }
      );

      if (!statusResponse.ok) {
        console.error('❌ [API] 查询任务状态失败');
        continue;
      }

      const statusData = await statusResponse.json();
      const taskStatus = statusData.output?.task_status;

      console.log(`🔄 [API] 轮询 ${attempt}/${maxAttempts}，状态: ${taskStatus}`);

      if (taskStatus === 'SUCCEEDED') {
        // 任务成功
        imageUrl = statusData.output?.results?.[0]?.url;
        console.log('✅ [API] 图片生成成功!');
        break;
      } else if (taskStatus === 'FAILED') {
        // 任务失败
        const errorMessage = statusData.output?.message || '图片生成失败';
        console.error('❌ [API] 任务失败:', errorMessage);
        throw new Error(errorMessage);
      }
      // 继续等待（PENDING 或 RUNNING 状态）
    }

    if (!imageUrl) {
      console.error('❌ [API] 超时：任务未在规定时间内完成');
      throw new Error('图片生成超时（60秒），请重试');
    }

    console.log('🎉 [API] 图片 URL:', imageUrl.substring(0, 80) + '...');

    // 返回结果
    return NextResponse.json({
      url: imageUrl,
      revisedPrompt: prompt,
    });
  } catch (error: any) {
    console.error('💥 [API] 图片生成失败');
    console.error('   错误类型:', error.constructor?.name);
    console.error('   错误消息:', error.message);

    // 处理不同类型的错误
    let errorMessage = '图片生成失败，请重试';
    let statusCode = 500;

    if (error.message?.includes('InvalidApiKey') || error.message?.includes('Unauthorized')) {
      errorMessage = '通义万相 API Key 无效或已过期，请检查配置';
      statusCode = 401;
    } else if (error.message?.includes('Throttling') || error.message?.includes('rate')) {
      errorMessage = '请求过于频繁，请稍后再试';
      statusCode = 429;
    } else if (error.message?.includes('InsufficientBalance') || error.message?.includes('quota')) {
      errorMessage = 'API 额度不足，请检查账户余额';
      statusCode = 402;
    } else if (error.message?.includes('InvalidParameter')) {
      errorMessage = '参数错误，请检查输入';
      statusCode = 400;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('   返回错误:', errorMessage);

    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error.message,
        type: error.constructor?.name 
      },
      { status: statusCode }
    );
  }
}
