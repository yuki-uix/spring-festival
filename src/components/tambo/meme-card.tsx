"use client";

import { z } from "zod";
import { useState } from "react";

export const memeCardSchema = z.object({
  memes: z
    .array(
      z.object({
        title: z.string().describe("表情包标题"),
        description: z.string().describe("创意描述"),
        caption: z.string().describe("文案建议"),
        style: z
          .enum(["festive", "funny", "cute", "creative"])
          .describe("表情包风格：festive, funny, cute, creative"),
        scenario: z.string().describe("使用场景"),
        designTips: z
          .array(z.string())
          .min(1, "至少需要一个设计要点")
          .describe("设计要点数组，每个元素是一条设计建议"),
      })
    )
    .min(1, "至少需要生成一个表情包创意")
    .describe("表情包创意数组"),
});

type MemeCardProps = z.infer<typeof memeCardSchema>;

const styleConfig = {
  festive: {
    label: "喜庆风格",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
    icon: "🎊",
  },
  funny: {
    label: "搞笑风格",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-600",
    icon: "😂",
  },
  cute: {
    label: "可爱风格",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-600",
    icon: "🥰",
  },
  creative: {
    label: "创意风格",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600",
    icon: "💡",
  },
};

export const MemeCard = ({ memes }: MemeCardProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 验证并标准化风格值
  const getStyleConfig = (style: string) => {
    const validStyle = style as keyof typeof styleConfig;
    return styleConfig[validStyle] || styleConfig.festive;
  };

  // 防御性检查：确保 memes 是有效的数组
  if (!memes || !Array.isArray(memes) || memes.length === 0) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
        <p className="text-yellow-800">
          ⚠️ 暂无表情包创意数据。请重新生成。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-xl sm:text-2xl">🎨</span>
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          为您生成了 {memes.length} 个表情包创意
        </h3>
      </div>

      {memes.map((meme, index) => {
        const config = getStyleConfig(meme.style);
        return (
          <div
            key={index}
            className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow`}
          >
            {/* Header */}
            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl flex-shrink-0">{config.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className={`text-lg sm:text-xl font-bold ${config.textColor} mb-2 break-words`}>
                  {meme.title}
                </h4>
                <span
                  className={`inline-block text-xs px-2 sm:px-3 py-1 ${config.bgColor} ${config.textColor} rounded-full whitespace-nowrap`}
                >
                  {config.label}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-100">
              <h5 className="font-semibold text-gray-700 text-sm sm:text-base mb-2 flex items-center gap-2">
                <span>🎭</span>
                创意描述
              </h5>
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base break-words">
                {meme.description}
              </p>
            </div>

            {/* Caption */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-100">
              <h5 className="font-semibold text-gray-700 text-sm sm:text-base mb-2 flex items-center gap-2">
                <span>💬</span>
                文案建议
              </h5>
              <p className="text-base sm:text-lg font-medium text-gray-800 italic break-words">
                "{meme.caption}"
              </p>
            </div>

            {/* Scenario */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-100">
              <h5 className="font-semibold text-gray-700 text-sm sm:text-base mb-2 flex items-center gap-2">
                <span>📍</span>
                使用场景
              </h5>
              <p className="text-gray-800 text-sm sm:text-base break-words">{meme.scenario}</p>
            </div>

            {/* Design Tips */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-100">
              <h5 className="font-semibold text-gray-700 text-sm sm:text-base mb-3 flex items-center gap-2">
                <span>✨</span>
                设计要点
              </h5>
              <ul className="space-y-2">
                {meme.designTips && Array.isArray(meme.designTips) && meme.designTips.length > 0 ? (
                  meme.designTips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5 sm:mt-1 flex-shrink-0">●</span>
                      <span className="text-gray-700 text-sm sm:text-base flex-1 break-words">{tip}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic text-sm">暂无设计要点</li>
                )}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() =>
                  handleCopy(
                    `${meme.title}\n\n创意：${meme.description}\n\n文案：${meme.caption}`,
                    index
                  )
                }
                className={`flex-1 py-2.5 sm:py-2 px-4 rounded-lg font-medium text-sm sm:text-base transition-colors active:scale-95 ${
                  copiedIndex === index
                    ? "bg-green-500 text-white"
                    : `${config.bgColor} ${config.textColor} hover:opacity-80`
                }`}
              >
                {copiedIndex === index ? "✓ 已复制" : "📋 复制创意"}
              </button>
              <button
                onClick={() => handleCopy(meme.caption, index)}
                className={`sm:flex-initial py-2.5 sm:py-2 px-4 rounded-lg font-medium text-sm sm:text-base transition-colors active:scale-95 ${config.bgColor} ${config.textColor} hover:opacity-80`}
              >
                📝 复制文案
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
