"use client";

import { z } from "zod";
import { useState, useRef, useEffect } from "react";

export const generatedMemeImageSchema = z.object({
  url: z.string().describe("生成的图片 URL"),
  caption: z.string().describe("图片文案"),
  style: z
    .enum(["festive", "funny", "cute", "creative"])
    .describe("图片风格"),
  revisedPrompt: z.string().optional().describe("AI 优化后的提示词"),
});

type GeneratedMemeImageProps = z.infer<typeof generatedMemeImageSchema>;

const styleConfig = {
  festive: {
    label: "喜庆风格",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
    icon: "🎊",
    captionColor: "#ff0000", // 文字颜色（Canvas用）
    captionStroke: "#ffd700", // 文字描边色
  },
  funny: {
    label: "搞笑风格",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-600",
    icon: "😂",
    captionColor: "#ff6600",
    captionStroke: "#ffff00",
  },
  cute: {
    label: "可爱风格",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-600",
    icon: "🥰",
    captionColor: "#ff69b4",
    captionStroke: "#ffffff",
  },
  creative: {
    label: "创意风格",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
    icon: "💡",
    captionColor: "#9c27b0",
    captionStroke: "#e1bee7",
  },
};

export const GeneratedMemeImage = ({
  url,
  caption,
  style,
  revisedPrompt,
}: GeneratedMemeImageProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [compositeImageUrl, setCompositeImageUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const config = styleConfig[style] || styleConfig.festive;

  // 在图片上叠加文字
  useEffect(() => {
    const addTextToImage = async () => {
      if (!url || !caption) return;
      
      setIsProcessing(true);
      try {
        // 使用服务器代理 URL 来解决 CORS 问题
        const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
        
        const img = new Image();
        // 不再需要 crossOrigin，因为是同源请求
        
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          // 设置 Canvas 尺寸
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // 1. 绘制原始图片
          ctx.drawImage(img, 0, 0);

          // 2. 计算安全边距（8%-10%，这里使用9%作为平衡值）
          const safeMargin = img.width * 0.09; // 左右各9%安全边距
          const maxTextWidth = img.width - (safeMargin * 2); // 文字最大宽度

          // 3. 配置文字样式
          let fontSize = Math.floor(img.width * 0.08); // 根据图片大小调整字体
          ctx.font = `bold ${fontSize}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // 4. 动态调整字体大小，确保文字不超出安全区域
          let textWidth = ctx.measureText(caption).width;
          while (textWidth > maxTextWidth && fontSize > 12) {
            fontSize -= 2;
            ctx.font = `bold ${fontSize}px "PingFang SC", "Microsoft YaHei", Arial, sans-serif`;
            textWidth = ctx.measureText(caption).width;
          }

          // 5. 如果文字仍然太长，进行换行处理
          const lines: string[] = [];
          if (textWidth > maxTextWidth) {
            // 将文字分成多行
            const chars = caption.split('');
            let currentLine = '';
            
            for (const char of chars) {
              const testLine = currentLine + char;
              const testWidth = ctx.measureText(testLine).width;
              
              if (testWidth > maxTextWidth && currentLine.length > 0) {
                lines.push(currentLine);
                currentLine = char;
              } else {
                currentLine = testLine;
              }
            }
            
            if (currentLine.length > 0) {
              lines.push(currentLine);
            }
          } else {
            lines.push(caption);
          }

          // 6. 绘制文字（带描边效果，支持多行）
          const x = img.width / 2;
          const lineHeight = fontSize * 1.2; // 行高为字体大小的1.2倍
          const totalHeight = lines.length * lineHeight;
          const startY = img.height * 0.85 - (totalHeight / 2) + (lineHeight / 2);

          lines.forEach((line, index) => {
            const y = startY + (index * lineHeight);

            // 描边（白色/浅色，增加可读性）
            ctx.strokeStyle = config.captionStroke;
            ctx.lineWidth = Math.floor(fontSize * 0.15);
            ctx.lineJoin = "round";
            ctx.strokeText(line, x, y);

            // 填充（主色）
            ctx.fillStyle = config.captionColor;
            ctx.fillText(line, x, y);
          });

          // 7. 转换为图片 URL
          const compositeUrl = canvas.toDataURL("image/png", 0.95);
          setCompositeImageUrl(compositeUrl);
          setIsProcessing(false);
        };

        img.onerror = () => {
          console.error("图片加载失败，使用原始URL");
          setCompositeImageUrl(url);
          setIsProcessing(false);
        };

        img.src = proxyUrl; // 使用代理 URL
      } catch (error) {
        console.error("文字叠加失败:", error);
        setCompositeImageUrl(url); // 失败时使用原图
        setIsProcessing(false);
      }
    };

    addTextToImage();
  }, [url, caption, config.captionColor, config.captionStroke]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const downloadUrl = compositeImageUrl || url;
      
      // 创建下载链接
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `春节表情包-${caption}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("下载失败:", error);
      alert("下载失败，请右键点击图片另存为");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(compositeImageUrl || url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg max-w-2xl mx-auto`}
    >
      {/* Hidden Canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <span className="text-3xl sm:text-4xl flex-shrink-0">{config.icon}</span>
        <div className="min-w-0 flex-1">
          <h3 className={`text-base sm:text-lg md:text-xl font-bold ${config.textColor}`}>
            ✨ 表情包已生成！
          </h3>
          <span
            className={`inline-block text-xs px-2 sm:px-3 py-1 mt-1 ${config.bgColor} ${config.textColor} rounded-full whitespace-nowrap`}
          >
            {config.label}
          </span>
        </div>
      </div>

      {/* Caption */}
      <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 mb-3 sm:mb-4 border border-gray-200">
        <p className="text-gray-700 text-sm sm:text-base break-words">
          <span className="font-semibold">文案：</span>
          {caption}
        </p>
      </div>

      {/* Image Display */}
      <div className="relative bg-white rounded-lg sm:rounded-xl overflow-hidden mb-3 sm:mb-4 border-2 border-gray-200">
        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="text-white text-center p-4">
              <div className="animate-spin text-3xl sm:text-4xl mb-2">⚙️</div>
              <p className="text-xs sm:text-sm">正在添加文字...</p>
            </div>
          </div>
        )}
        <img
          src={compositeImageUrl || url}
          alt={caption}
          className="w-full h-auto"
          loading="lazy"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
        <button
          onClick={handleDownload}
          disabled={isDownloading || isProcessing}
          className={`flex-1 py-3 px-4 rounded-lg font-medium text-sm sm:text-base transition-colors active:scale-95 ${
            isDownloading || isProcessing
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isDownloading ? "⏳ 下载中..." : "💾 下载图片"}
        </button>
        <button
          onClick={handleCopyUrl}
          disabled={isProcessing}
          className={`sm:flex-initial py-3 px-4 rounded-lg font-medium text-sm sm:text-base transition-colors active:scale-95 ${
            copied
              ? "bg-green-500 text-white"
              : isProcessing
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {copied ? "✓ 已复制" : "🔗 复制链接"}
        </button>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3 mb-2.5 sm:mb-3">
        <p className="text-xs sm:text-sm text-blue-800 flex items-start gap-2">
          <span className="text-base flex-shrink-0">✨</span>
          <span>
            文字已使用 Canvas 技术清晰叠加到图片上，带有 9% 安全边距，确保完美显示效果，文字不会超出表情包边界！
          </span>
        </p>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 sm:p-3">
        <p className="text-xs sm:text-sm text-yellow-800 flex items-start gap-2">
          <span className="text-base flex-shrink-0">⚠️</span>
          <span>
            通义万相生成的图片链接会在 <strong>24 小时后失效</strong>
            ，请及时下载保存到本地。
          </span>
        </p>
      </div>

      {/* Optional: Show revised prompt for debugging */}
      {revisedPrompt && (
        <details className="mt-3 sm:mt-4">
          <summary className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            查看 AI 优化后的提示词
          </summary>
          <p className="text-xs text-gray-600 mt-2 p-2.5 sm:p-3 bg-gray-50 rounded break-words">
            {revisedPrompt}
          </p>
        </details>
      )}
    </div>
  );
};
