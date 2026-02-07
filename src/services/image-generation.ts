/**
 * 生成春节表情包图片
 * 通过 API 路由调用阿里云通义万相
 * @param params 图片生成参数
 * @returns 包含图片 URL 的对象
 */
export async function generateMemeImage(params: {
  description: string;
  style: 'festive' | 'funny' | 'cute' | 'creative';
  caption: string;
}) {
  try {
    console.log('🎨 开始生成图片，参数:', params);

    // 调用服务器端 API 路由
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    console.log('📡 API 响应状态:', response.status);

    // 获取响应数据
    const data = await response.json();
    console.log('📦 API 响应数据:', data);

    if (!response.ok) {
      console.error('❌ API 返回错误:', data);
      throw new Error(data.error || data.details || '图片生成失败');
    }

    if (!data.url) {
      console.error('❌ 响应中没有图片 URL');
      throw new Error('图片 URL 为空');
    }

    console.log('✅ 图片生成成功:', data.url);

    return {
      url: data.url,
      revisedPrompt: data.revisedPrompt,
    };
  } catch (error) {
    console.error('💥 图片生成失败，详细错误:', error);
    
    if (error instanceof Error) {
      // 保留原始错误信息
      throw error;
    }
    
    throw new Error('图片生成失败，请重试');
  }
}

/**
 * 验证通义万相 API Key 是否配置
 */
export function isDashScopeConfigured(): boolean {
  return !!process.env.DASHSCOPE_API_KEY && process.env.DASHSCOPE_API_KEY.length > 0;
}
