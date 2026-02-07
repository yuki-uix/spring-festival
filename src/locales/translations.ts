import { Language } from '@/lib/i18n';

/**
 * Translation keys and values for the application
 */

export const translations = {
  // Home Page
  home: {
    title: {
      zh: '春节祝福生成器',
      en: 'Lunar New Year Blessing Generator',
    },
    subtitle: {
      zh: '用 AI 生成独特的春节祝福语和趣味表情包',
      en: 'Generate unique Lunar New Year blessings and fun memes with AI',
    },
    blessings: {
      title: {
        zh: '春节祝福语',
        en: 'New Year Blessings',
      },
      description: {
        zh: '生成个性化的春节祝福语',
        en: 'Generate personalized New Year blessings',
      },
      button: {
        zh: '开始生成 →',
        en: 'Start Generating →',
      },
      styleTraditional: {
        zh: '传统风格',
        en: 'Traditional',
      },
      styleHumorous: {
        zh: '幽默风格',
        en: 'Humorous',
      },
      styleLiterary: {
        zh: '文艺风格',
        en: 'Literary',
      },
    },
    memes: {
      title: {
        zh: '趣味表情包',
        en: 'Fun Memes',
      },
      description: {
        zh: '生成春节主题的趣味表情包',
        en: 'Generate fun Lunar New Year themed memes',
      },
      button: {
        zh: '开始生成 →',
        en: 'Start Generating →',
      },
      styleFestive: {
        zh: '喜庆风格',
        en: 'Festive',
      },
      styleFunny: {
        zh: '搞笑风格',
        en: 'Funny',
      },
      styleCute: {
        zh: '可爱风格',
        en: 'Cute',
      },
    },
    features: {
      title: {
        zh: '功能特色',
        en: 'Key Features',
      },
      aiGeneration: {
        title: {
          zh: '智能生成',
          en: 'AI Generation',
        },
        description: {
          zh: '基于 AI 技术，快速生成个性化内容',
          en: 'Powered by AI to quickly generate personalized content',
        },
      },
      multipleStyles: {
        title: {
          zh: '多种风格',
          en: 'Multiple Styles',
        },
        description: {
          zh: '传统、幽默、文艺等多种风格选择',
          en: 'Choose from traditional, humorous, literary, and more',
        },
      },
      easyShare: {
        title: {
          zh: '一键分享',
          en: 'Easy Sharing',
        },
        description: {
          zh: '快速复制或下载，轻松分享给亲朋好友',
          en: 'Quickly copy or download to share with friends and family',
        },
      },
    },
    footer: {
      greeting: {
        zh: '🎊 恭祝新春快乐，万事如意！🎊',
        en: '🎊 Happy Lunar New Year! Wishing you all the best! 🎊',
      },
    },
  },
  // Blessings Page
  blessings: {
    backHome: {
      zh: '返回首页',
      en: 'Back to Home',
    },
    backShort: {
      zh: '返回',
      en: 'Back',
    },
    title: {
      zh: '春节祝福语生成器',
      en: 'New Year Blessing Generator',
    },
    guideTitle: {
      zh: '使用指南',
      en: 'User Guide',
    },
    styleSelection: {
      zh: '选择祝福语风格：',
      en: 'Choose blessing style:',
    },
    styles: {
      zh: '传统、幽默、文艺、商务',
      en: 'Traditional, Humorous, Literary, Business',
    },
    targetAudience: {
      zh: '指定对象：家人、朋友、同事、客户等',
      en: 'Target audience: Family, Friends, Colleagues, Clients, etc.',
    },
    multipleGeneration: {
      zh: '可以要求生成多条祝福语供选择',
      en: 'Request multiple blessings to choose from',
    },
    quickStart: {
      zh: '快速开始示例：',
      en: 'Quick Start Examples:',
    },
    example1: {
      zh: '"生成传统风格的春节祝福语"',
      en: '"Generate traditional New Year blessings"',
    },
    example2: {
      zh: '"给朋友的幽默祝福语"',
      en: '"Humorous blessings for friends"',
    },
    example3: {
      zh: '"文艺风格的新年寄语"',
      en: '"Literary New Year wishes"',
    },
  },
  // Memes Page
  memes: {
    backHome: {
      zh: '返回首页',
      en: 'Back to Home',
    },
    backShort: {
      zh: '返回',
      en: 'Back',
    },
    title: {
      zh: '春节表情包生成器',
      en: 'New Year Meme Generator',
    },
    guideTitle: {
      zh: '使用指南',
      en: 'User Guide',
    },
    styleSelection: {
      zh: '选择表情包风格：',
      en: 'Choose meme style:',
    },
    styles: {
      zh: '喜庆、搞笑、可爱、创意',
      en: 'Festive, Funny, Cute, Creative',
    },
    describe: {
      zh: '描述你想要的表情包内容和场景',
      en: 'Describe your desired meme content and scenario',
    },
    aiGeneration: {
      zh: 'AI 会生成表情包创意和文案建议',
      en: 'AI will generate meme ideas and caption suggestions',
    },
    quickStart: {
      zh: '快速开始示例：',
      en: 'Quick Start Examples:',
    },
    example1: {
      zh: '"发红包的搞笑表情包"',
      en: '"Funny meme about giving red envelopes"',
    },
    example2: {
      zh: '"可爱风格的拜年表情包"',
      en: '"Cute style New Year greeting meme"',
    },
    example3: {
      zh: '"吃饺子主题的创意表情包"',
      en: '"Creative meme about eating dumplings"',
    },
  },
} as const;

/**
 * Get translated text by key path
 * @param language Current language
 * @param keyPath Dot-separated path to translation key (e.g., 'home.title')
 * @returns Translated text or key path if not found
 */
export function t(language: Language, keyPath: string): string {
  const keys = keyPath.split('.');
  let value: any = translations;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Translation key not found: ${keyPath}`);
      return keyPath;
    }
  }

  if (value && typeof value === 'object' && language in value) {
    return value[language];
  }

  console.warn(`Translation not found for language ${language}: ${keyPath}`);
  return keyPath;
}

/**
 * Create a translation function bound to a specific language
 */
export function createTranslator(language: Language) {
  return (keyPath: string) => t(language, keyPath);
}
