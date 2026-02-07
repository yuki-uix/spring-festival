"use client";

import { TamboProvider } from "@tambo-ai/react";
import { components, tools } from "@/lib/tambo";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import Link from "next/link";

const BLESSINGS_SYSTEM_PROMPT = `你是一个专业的春节祝福语生成助手。你的任务是根据用户的需求生成高质量、有创意的春节祝福语。

**可用风格（必须使用以下英文值）：**
1. **traditional（传统风格）**：使用经典的成语和吉祥话，如"恭喜发财"、"万事如意"等
2. **humorous（幽默风格）**：轻松诙谐，适合年轻人和朋友之间
3. **literary（文艺风格）**：优美抒情，富有诗意和文学性
4. **business（商务风格）**：正式得体，适合职场和商务场合

**生成要求：**
- 根据用户指定的对象（家人、朋友、同事、客户等）调整语气
- 每条祝福语保持在50-100字之间
- 确保内容积极向上、吉祥喜庆
- 可以融入2025年的元素（蛇年）
- 如果用户要求多条，生成3-5条供选择
- **重要：style 字段必须使用以下值之一：traditional, humorous, literary, business**
- 使用 BlessingCard 组件来展示生成的祝福语

**可交互功能响应：**
- 当用户点赞 👍 某条祝福语时，立即生成 2-3 条更多相同风格的祝福语
- 当用户点踩 👎 某条祝福语时，立即生成 2-3 条完全不同风格的祝福语
- 当用户点击"再来一条相似的"时，生成相同风格但内容完全不同的祝福语
- 当用户点击"换个风格试试"时，生成另一种随机风格的祝福语
- 根据用户的评价历史，学习用户偏好，优先推荐用户喜欢的风格
- 用户操作后，用自然的语言回应，如"看来您喜欢这种风格！我再为您生成几条："

**输出格式：**
使用 BlessingCard 组件展示祝福语，每条祝福语包含：
- title: 祝福语标题
- content: 完整的祝福语内容
- style: 必须是 "traditional"、"humorous"、"literary" 或 "business" 之一
- targetAudience: 适用对象

现在，请根据用户的需求开始生成春节祝福语！`;

export default function BlessingsPage() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""}
      components={components}
      tools={tools}
      systemPrompt={BLESSINGS_SYSTEM_PROMPT}
    >
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-100">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur border-b border-red-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-3 text-gray-600 hover:text-red-600 active:text-red-700 transition-colors min-w-0"
            >
              <span className="text-xl sm:text-2xl flex-shrink-0">←</span>
              <span className="font-medium text-sm sm:text-base hidden sm:inline">返回首页</span>
              <span className="font-medium text-sm sm:hidden">返回</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-center min-w-0">
              <span className="text-2xl sm:text-3xl flex-shrink-0">✨</span>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-red-600 truncate">
                春节祝福语生成器
              </h1>
            </div>
            <div className="w-16 sm:w-24 flex-shrink-0" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          {/* Instructions */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-red-200 sm:border-2">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
              <span>💡</span>
              使用指南
            </h2>
            <div className="space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base">
              <p>
                • 选择祝福语风格：
                <span className="font-medium text-red-600">
                  传统、幽默、文艺、商务
                </span>
              </p>
              <p>
                • 指定对象：家人、朋友、同事、客户等
              </p>
              <p>• 可以要求生成多条祝福语供选择</p>
            </div>
            
            {/* Quick Start Examples */}
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                快速开始示例：
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <span className="px-2 sm:px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs sm:text-sm whitespace-nowrap">
                  "生成传统风格的春节祝福语"
                </span>
                <span className="px-2 sm:px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs sm:text-sm whitespace-nowrap">
                  "给朋友的幽默祝福语"
                </span>
                <span className="px-2 sm:px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs sm:text-sm whitespace-nowrap">
                  "文艺风格的新年寄语"
                </span>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-red-200 sm:border-2 overflow-hidden h-[500px] sm:h-[550px] md:h-[600px]">
            <MessageThreadFull />
          </div>
        </div>
      </div>
    </TamboProvider>
  );
}
