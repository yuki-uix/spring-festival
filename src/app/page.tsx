"use client";

import { ApiKeyCheck } from "@/components/ApiKeyCheck";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/hooks/useLanguage";
import { createTranslator } from "@/locales/translations";
import Link from "next/link";

export default function Home() {
  const { language, isInitialized } = useLanguage();
  const t = createTranslator(language);

  // Show loading state to prevent flash of wrong language
  if (!isInitialized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 flex flex-col items-center justify-start md:justify-center p-4 sm:p-6 lg:p-8">
      <LanguageSwitcher />
      
      <main className="max-w-6xl w-full space-y-6 sm:space-y-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 px-2">
          <div className="text-5xl sm:text-6xl md:text-7xl animate-bounce">🧧</div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-600 tracking-tight">
            {t('home.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl leading-relaxed">
            {t('home.subtitle')}
          </p>
        </div>

        {/* API Key Check and Main Features */}
        <ApiKeyCheck>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-12">
            {/* Blessings Generator */}
            <Link href="/blessings" className="block">
              <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl active:shadow-xl transition-all duration-300 p-6 sm:p-8 cursor-pointer border-2 sm:border-4 border-red-200 hover:border-red-400 active:border-red-500 transform hover:-translate-y-1 active:translate-y-0">
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform">
                    ✨
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600">
                    {t('home.blessings.title')}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                    {t('home.blessings.description')}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center text-xs sm:text-sm">
                    <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                      {t('home.blessings.styleTraditional')}
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                      {t('home.blessings.styleHumorous')}
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-pink-100 text-pink-700 rounded-full font-medium">
                      {t('home.blessings.styleLiterary')}
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-4 text-red-500 font-semibold text-sm sm:text-base group-hover:underline">
                    {t('home.blessings.button')}
                  </div>
                </div>
              </div>
            </Link>

            {/* Memes Generator */}
            <Link href="/memes" className="block">
              <div className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl active:shadow-xl transition-all duration-300 p-6 sm:p-8 cursor-pointer border-2 sm:border-4 border-yellow-200 hover:border-yellow-400 active:border-yellow-500 transform hover:-translate-y-1 active:translate-y-0">
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="text-5xl sm:text-6xl group-hover:scale-110 transition-transform">
                    😄
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-600">
                    {t('home.memes.title')}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                    {t('home.memes.description')}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center text-xs sm:text-sm">
                    <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                      {t('home.memes.styleFestive')}
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                      {t('home.memes.styleFunny')}
                    </span>
                    <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
                      {t('home.memes.styleCute')}
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-4 text-yellow-600 font-semibold text-sm sm:text-base group-hover:underline">
                    {t('home.memes.button')}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </ApiKeyCheck>

        {/* Features Section */}
        <div className="bg-white/90 backdrop-blur rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 mt-6 sm:mt-8">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-6">
            {t('home.features.title')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-3xl sm:text-4xl">🎯</div>
              <h4 className="font-semibold text-base sm:text-lg text-gray-800">
                {t('home.features.aiGeneration.title')}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('home.features.aiGeneration.description')}
              </p>
            </div>
            <div className="text-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-3xl sm:text-4xl">🎨</div>
              <h4 className="font-semibold text-base sm:text-lg text-gray-800">
                {t('home.features.multipleStyles.title')}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('home.features.multipleStyles.description')}
              </p>
            </div>
            <div className="text-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="text-3xl sm:text-4xl">📱</div>
              <h4 className="font-semibold text-base sm:text-lg text-gray-800">
                {t('home.features.easyShare.title')}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t('home.features.easyShare.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-xs sm:text-sm space-y-2 py-4">
          <p className="font-medium">{t('home.footer.greeting')}</p>
        </div>
      </main>
    </div>
  );
}
