import { NextRequest, NextResponse } from 'next/server';

/**
 * 图片代理 API
 * 用于解决阿里云通义万相图片的 CORS 跨域问题
 */
export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取图片 URL
    const imageUrl = request.nextUrl.searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: '缺少图片 URL 参数' },
        { status: 400 }
      );
    }

    console.log('🖼️ [代理] 获取图片:', imageUrl.substring(0, 100) + '...');

    // 从阿里云获取图片
    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.error('❌ [代理] 图片获取失败:', response.status);
      return NextResponse.json(
        { error: '图片获取失败' },
        { status: response.status }
      );
    }

    // 获取图片数据
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    console.log('✅ [代理] 图片获取成功，大小:', imageBuffer.byteLength, '字节');

    // 返回图片，并设置正确的 CORS 头
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*', // 允许跨域
        'Cache-Control': 'public, max-age=86400', // 缓存 24 小时
      },
    });
  } catch (error: any) {
    console.error('💥 [代理] 图片代理失败:', error.message);
    return NextResponse.json(
      { error: '图片代理失败', details: error.message },
      { status: 500 }
    );
  }
}
