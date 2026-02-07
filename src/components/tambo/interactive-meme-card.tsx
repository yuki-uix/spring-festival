"use client";

import { z } from "zod";
import { useState } from "react";
import { withInteractable } from "@tambo-ai/react";

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

// 基础的 MemeCard 组件（保持不变以兼容现有代码）
export const MemeCard = ({ memes }: MemeCardProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getStyleConfig = (style: string) => {
    const validStyle = style as keyof typeof styleConfig;
    return styleConfig[validStyle] || styleConfig.festive;
  };

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

// 可交互版本的 MemeCard
type InteractiveMemeCardProps = MemeCardProps & {
  onUserAction?: (action: { type: string; data: any }) => void;
};

const InteractiveMemeCardBase = ({ 
  memes, 
  onUserAction 
}: InteractiveMemeCardProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [selectedForGeneration, setSelectedForGeneration] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);

    onUserAction?.({
      type: 'copy',
      data: { index, meme: memes[index] }
    });
  };

  const handleRate = (index: number, stars: number) => {
    setRatings({ ...ratings, [index]: stars });

    onUserAction?.({
      type: 'rate',
      data: { 
        index, 
        rating: stars,
        meme: memes[index],
        message: stars >= 4 
          ? `用户给这个创意打了${stars}星（高分），可以生成更多类似的`
          : stars <= 2
          ? `用户给这个创意打了${stars}星（低分），请调整创意方向`
          : `用户给这个创意打了${stars}星（中等），可以适当改进`
      }
    });
  };

  const handleGenerateImage = (index: number) => {
    setSelectedForGeneration(index);
    const meme = memes[index];
    
    // 发送明确的消息给 AI
    onUserAction?.({
      type: 'generate_image_request',
      data: { 
        index,
        meme: meme,
        // 明确的指令消息
        userMessage: `请为这个创意生成实际的图片：${meme.title}。描述：${meme.description}。文案：${meme.caption}。风格：${meme.style}`,
        toolCall: {
          tool: 'generateMemeImage',
          params: {
            description: meme.description,
            style: meme.style,
            caption: meme.caption
          }
        }
      }
    });
  };

  const handleRefineIdea = (index: number, refinement: string) => {
    onUserAction?.({
      type: 'refine',
      data: { 
        index,
        meme: memes[index],
        refinement,
        message: `用户希望优化这个创意：${refinement}`
      }
    });
  };

  const getStyleConfig = (style: string) => {
    const validStyle = style as keyof typeof styleConfig;
    return styleConfig[validStyle] || styleConfig.festive;
  };

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
        const userRating = ratings[index] || 0;

        return (
          <div
            key={index}
            className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg transition-all ${
              selectedForGeneration === index ? 'ring-4 ring-blue-400' : ''
            }`}
          >
            {/* Header with Star Rating */}
            <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="text-3xl sm:text-4xl flex-shrink-0">{config.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className={`text-lg sm:text-xl font-bold ${config.textColor} mb-2 break-words`}>
                  {meme.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block text-xs px-2 sm:px-3 py-1 ${config.bgColor} ${config.textColor} rounded-full whitespace-nowrap`}
                  >
                    {config.label}
                  </span>
                  {/* Star Rating */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(index, star)}
                        className="text-lg hover:scale-110 transition-transform"
                      >
                        {star <= userRating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>
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
            <div className="flex flex-col gap-2">
              {/* Primary Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
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

              {/* AI Interaction - Generate Image */}
              <button
                onClick={() => handleGenerateImage(index)}
                className="w-full py-3 px-4 rounded-lg font-bold text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95 shadow-md"
                disabled={selectedForGeneration === index}
              >
                {selectedForGeneration === index ? '⏳ 正在等待 AI 响应...' : '🎨 生成这个创意的图片'}
              </button>

              {/* AI Interaction - Refinement Options */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleRefineIdea(index, '让文案更幽默')}
                  className="py-2 px-3 rounded-lg text-xs sm:text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-colors active:scale-95"
                >
                  😄 更幽默
                </button>
                <button
                  onClick={() => handleRefineIdea(index, '让画面更简洁')}
                  className="py-2 px-3 rounded-lg text-xs sm:text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-colors active:scale-95"
                >
                  ✨ 更简洁
                </button>
                <button
                  onClick={() => handleRefineIdea(index, '增加更多细节')}
                  className="py-2 px-3 rounded-lg text-xs sm:text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-colors active:scale-95"
                >
                  🔍 更详细
                </button>
                <button
                  onClick={() => handleRefineIdea(index, '换个场景')}
                  className="py-2 px-3 rounded-lg text-xs sm:text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-colors active:scale-95"
                >
                  🔄 换场景
                </button>
              </div>
            </div>

            {/* User Feedback Display */}
            {userRating > 0 && (
              <div className={`mt-3 p-2 rounded-lg text-xs ${
                userRating >= 4 
                  ? 'bg-green-50 text-green-700'
                  : userRating <= 2
                  ? 'bg-red-50 text-red-700'
                  : 'bg-blue-50 text-blue-700'
              }`}>
                {userRating >= 4 
                  ? `✓ 已告诉 AI 你给了 ${userRating} 星高分，会生成更多类似的`
                  : userRating <= 2
                  ? `✓ 已告诉 AI 你给了 ${userRating} 星低分，会调整创意方向`
                  : `✓ 已告诉 AI 你给了 ${userRating} 星，会适当改进`}
              </div>
            )}

            {selectedForGeneration === index && (
              <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  ✓ 已选择此创意！正在等待 AI 响应并调用图片生成工具...
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  提示：如果 AI 没有响应，请在聊天框中输入："请生成这个创意的图片"
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// 使用 withInteractable 包装组件
export const InteractiveMemeCard = withInteractable(
  InteractiveMemeCardBase,
  {
    componentId: 'meme-card-interactive',
    interactionDescription: '用户可以对表情包创意进行评分、选择生成图片、优化创意内容等交互操作。当用户点击"生成这个创意的图片"按钮时，你应该立即调用 generateMemeImage 工具来生成实际的图片。'
  }
);
