"use client";

import { z } from "zod";
import { useState } from "react";

export const blessingCardSchema = z.object({
  blessings: z
    .array(
      z.object({
        title: z.string().describe("祝福语标题"),
        content: z.string().describe("祝福语内容"),
        style: z
          .enum(["traditional", "humorous", "literary", "business"])
          .describe("祝福语风格：traditional, humorous, literary, business"),
        targetAudience: z.string().describe("适用对象"),
      })
    )
    .min(1, "至少需要生成一条祝福语")
    .describe("祝福语数组"),
});

type BlessingCardProps = z.infer<typeof blessingCardSchema>;

const styleConfig = {
  traditional: {
    label: "传统风格",
    color: "red",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
    icon: "🧧",
  },
  humorous: {
    label: "幽默风格",
    color: "yellow",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    textColor: "text-yellow-600",
    icon: "😄",
  },
  literary: {
    label: "文艺风格",
    color: "pink",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    textColor: "text-pink-600",
    icon: "📝",
  },
  business: {
    label: "商务风格",
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    icon: "💼",
  },
};

export const BlessingCard = ({ blessings }: BlessingCardProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 验证并标准化风格值
  const getStyleConfig = (style: string) => {
    const validStyle = style as keyof typeof styleConfig;
    return styleConfig[validStyle] || styleConfig.traditional;
  };

  // 防御性检查：确保 blessings 是有效的数组
  if (!blessings || !Array.isArray(blessings) || blessings.length === 0) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
        <p className="text-red-800">
          ⚠️ 暂无祝福语数据。请重新生成。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-xl sm:text-2xl">✨</span>
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800">
          为您生成了 {blessings.length} 条祝福语
        </h3>
      </div>

      {blessings.map((blessing, index) => {
        const config = getStyleConfig(blessing.style);
        return (
          <div
            key={index}
            className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow`}
          >
            {/* Header */}
            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl flex-shrink-0">{config.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className={`text-base sm:text-lg font-bold ${config.textColor} mb-2`}>
                  {blessing.title}
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 sm:py-1 ${config.bgColor} ${config.textColor} rounded-full whitespace-nowrap`}
                  >
                    {config.label}
                  </span>
                  <span className="text-xs px-2 py-0.5 sm:py-1 bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
                    适用：{blessing.targetAudience}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 border border-gray-100">
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base md:text-lg break-words">
                {blessing.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => handleCopy(blessing.content, index)}
                className={`flex-1 py-2.5 sm:py-2 px-4 rounded-lg font-medium text-sm sm:text-base transition-colors active:scale-95 ${
                  copiedIndex === index
                    ? "bg-green-500 text-white"
                    : `${config.bgColor} ${config.textColor} hover:opacity-80`
                }`}
              >
                {copiedIndex === index ? "✓ 已复制" : "📋 复制"}
              </button>
              <button
                onClick={() => {
                  const text = `${blessing.title}\n\n${blessing.content}`;
                  if (navigator.share) {
                    navigator.share({ text });
                  } else {
                    handleCopy(text, index);
                  }
                }}
                className={`sm:flex-initial py-2.5 sm:py-2 px-4 rounded-lg font-medium text-sm sm:text-base transition-colors active:scale-95 ${config.bgColor} ${config.textColor} hover:opacity-80`}
              >
                📤 分享
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
