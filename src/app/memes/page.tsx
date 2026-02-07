"use client";

import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
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

2. **生成图片阶段**（用户要求生成图片）
   - 当用户明确说"生成图片"、"我要图片"、"帮我做成图片"等时
   - 先告知用户："好的，我现在开始为您生成图片，大约需要 10-20 秒，请稍候..."
   - 调用 generateMemeImage 工具生成图片
   - 使用 GeneratedMemeImage 组件展示生成的图片
   - 提醒用户："图片已生成！请点击'下载图片'按钮保存，因为链接会在 1 小时后失效。"

**重要注意事项：**
- 只有在用户明确要求生成图片时才调用 generateMemeImage 工具
- 生成图片前要告知用户需要等待
- 图片生成失败时给出友好提示，建议修改创意后重试
- 每次生成图片都会产生成本（约 $0.04），所以要确认用户真的需要
- 生成的图片链接 1 小时后会失效，务必提醒用户下载

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

用户："生成第一个的图片"
AI："好的，我现在开始为您生成图片，大约需要 10-20 秒，请稍候..." [调用 generateMemeImage 工具] [使用 GeneratedMemeImage 组件展示]

现在，请根据用户的需求开始工作！`;

export default function MemesPage() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}
      components={components}
      tools={tools}
      systemPrompt={MEMES_SYSTEM_PROMPT}
    >
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-100">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur border-b border-yellow-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-3 text-gray-600 hover:text-yellow-600 active:text-yellow-700 transition-colors min-w-0"
            >
              <span className="text-xl sm:text-2xl flex-shrink-0">←</span>
              <span className="font-medium text-sm sm:text-base hidden sm:inline">返回首页</span>
              <span className="font-medium text-sm sm:hidden">返回</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center min-w-0">
              <span className="text-2xl sm:text-3xl flex-shrink-0">😄</span>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-yellow-600 truncate">
                春节表情包生成器
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
              使用指南
            </h2>
            <div className="space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base">
              <p>
                • 选择表情包风格：
                <span className="font-medium text-yellow-600">
                  喜庆、搞笑、可爱、创意
                </span>
              </p>
              <p>
                • 描述你想要的表情包内容和场景
              </p>
              <p>• AI 会生成表情包创意和文案建议</p>
            </div>
            
            {/* Quick Start Examples */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                快速开始示例：
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="px-2 sm:px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs sm:text-sm whitespace-nowrap">
                  "发红包的搞笑表情包"
                </span>
                <span className="px-2 sm:px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs sm:text-sm whitespace-nowrap">
                  "可爱风格的拜年表情包"
                </span>
                <span className="px-2 sm:px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs sm:text-sm whitespace-nowrap">
                  "吃饺子主题的创意表情包"
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
    </TamboProvider>
  );
}
