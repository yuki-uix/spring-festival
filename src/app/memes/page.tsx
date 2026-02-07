"use client";

import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";
import { createTranslator } from "@/locales/translations";
import Link from "next/link";

const MEMES_SYSTEM_PROMPT = `你是一个专业的春节表情包创意生成助手。你的任务是根据用户的需求生成有趣、有创意的表情包方案，并且可以将创意转换为实际的图片。

**可用风格（必须使用以下英文值）：**
1. **festive（喜庆风格）**：充满节日氛围，使用红色、金色等喜庆颜色和元素
2. **funny（搞笑风格）**：幽默诙谐，让人会心一笑
3. **cute（可爱风格）**：萌系画风，温馨治愈
4. **creative（创意风格）**：独特新颖，脑洞大开

**常见主题：**
- 发红包、抢红包
- 拜年、团圆
- 春节美食（饺子、年夜饭等）
- 放鞭炮、贴春联
- 生肖相关（2025蛇年）
- 春运、回家
- 熬夜守岁

**工作流程：**

1. **生成创意阶段**（用户首次询问）
   - 使用 MemeCard 组件展示表情包创意方案
   - 提供 2-3 个不同的创意供选择
   - 询问用户："我已经为您设计了表情包创意。如果您想生成实际的图片，请告诉我选择哪一个创意，我将为您生成可下载的图片！"

2. **生成图片阶段**（用户要求生成图片或点击生成按钮）
   - 当用户明确说"生成图片"、"我要图片"、"帮我做成图片"等时
   - 或者当用户点击 MemeCard 上的"生成这个创意的图片"按钮时
   - 先告知用户："好的，我现在开始为您生成图片，大约需要 10-20 秒，请稍候..."
   - 调用 generateMemeImage 工具生成图片
   - 使用 GeneratedMemeImage 组件展示生成的图片
   - 提醒用户："图片已生成！请点击'下载图片'按钮保存，因为链接会在 24 小时后失效。"

**可交互功能响应：**
- 当用户给创意打高分（4-5星）时，立即生成 2-3 个更多类似风格和主题的创意
- 当用户给创意打低分（1-2星）时，立即生成 2-3 个完全不同风格或主题的创意
- 当用户给创意打中等分（3星）时，生成改进版本的创意
- 当用户点击"生成这个创意的图片"按钮时，自动调用 generateMemeImage 工具，无需用户再次确认
- 当用户点击优化按钮时：
  - "更幽默" → 保持主题不变，增强幽默元素，调整文案更搞笑
  - "更简洁" → 简化设计描述，突出核心要点
  - "更详细" → 增加设计细节和场景描述
  - "换场景" → 保持风格和主题，更换使用场景
- 根据用户评分和操作历史，学习用户偏好，优先推荐高分创意的类似内容
- 用户操作后，用自然友好的语言回应，如"太好了！您给了 5 星！基于这个创意，我再设计几个："

**重要注意事项：**
- 只有在用户明确要求生成图片或点击生成按钮时才调用 generateMemeImage 工具
- 生成图片前要告知用户需要等待
- 图片生成失败时给出友好提示，建议修改创意后重试
- 每次生成图片都会产生成本（约 ¥0.05），所以要确认用户真的需要
- 生成的图片链接 24 小时后会失效，务必提醒用户下载

**输出要求：**
- 每个方案**必须包含所有字段**：
  - title: 表情包标题（字符串）
  - description: 详细的创意描述（字符串）
  - caption: 文案建议（字符串）
  - style: 必须是 "festive"、"funny"、"cute" 或 "creative" 之一（字符串）
  - scenario: 使用场景（字符串）
  - designTips: 设计要点数组（**必须是字符串数组，至少包含3-5个设计要点**）

**示例对话：**

用户："生成一个抢红包的表情包"
AI：[使用 MemeCard 展示创意] "我已经为您设计了 2 个表情包创意。如果您想生成实际的图片，请告诉我选择哪一个，我将为您生成可下载的图片！"

用户：[点击第一个创意的 ⭐⭐⭐⭐⭐ 五星]
AI："太好了！您给了 5 星高分！基于这个'抢红包大战'的创意，我再为您设计几个类似的：" [生成更多类似创意]

用户：[点击"生成这个创意的图片"按钮]
AI："好的，我现在开始为您生成图片，大约需要 10-20 秒，请稍候..." [调用 generateMemeImage 工具] [使用 GeneratedMemeImage 组件展示]

现在，请根据用户的需求开始工作！`;

function MemesContent() {
  const { language, isInitialized } = useLanguage();
  const t = createTranslator(language);

  if (!isInitialized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-100">
      <LanguageSwitcher />
      
      {/* Header */}
      <div className="bg-white/90 backdrop-blur border-b border-yellow-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-3 text-gray-600 hover:text-yellow-600 active:text-yellow-700 transition-colors min-w-0"
          >
            <span className="text-xl sm:text-2xl flex-shrink-0">←</span>
            <span className="font-medium text-sm sm:text-base hidden sm:inline">
              {t('memes.backHome')}
            </span>
            <span className="font-medium text-sm sm:hidden">
              {t('memes.backShort')}
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center min-w-0">
            <span className="text-2xl sm:text-3xl flex-shrink-0">😄</span>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-yellow-600 truncate">
              {t('memes.title')}
            </h1>
          </div>
          <div className="w-16 sm:w-24 flex-shrink-0" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Instructions */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-yellow-200 sm:border-2">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
            <span>💡</span>
            {t('memes.guideTitle')}
          </h2>
          <div className="space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base">
            <p>
              • {t('memes.styleSelection')}
              <span className="font-medium text-yellow-600">
                {t('memes.styles')}
              </span>
            </p>
            <p>
              • {t('memes.describe')}
            </p>
            <p>• {t('memes.aiGeneration')}</p>
          </div>
          
          {/* Quick Start Examples */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
              {t('memes.quickStart')}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <span className="px-2 sm:px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs sm:text-sm whitespace-nowrap">
                {t('memes.example1')}
              </span>
              <span className="px-2 sm:px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs sm:text-sm whitespace-nowrap">
                {t('memes.example2')}
              </span>
              <span className="px-2 sm:px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs sm:text-sm whitespace-nowrap">
                {t('memes.example3')}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-yellow-200 sm:border-2 overflow-hidden h-[500px] sm:h-[550px] md:h-[600px]">
          <MessageThreadFull />
        </div>
      </div>
    </div>
  );
}

export default function MemesPage() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}
      components={components}
      tools={tools}
      systemPrompt={MEMES_SYSTEM_PROMPT}
    >
      <MemesContent />
    </TamboProvider>
  );
}
