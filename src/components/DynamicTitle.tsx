"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

interface DynamicTitleProps {
  zhTitle: string;
  enTitle: string;
}

export function DynamicTitle({ zhTitle, enTitle }: DynamicTitleProps) {
  const { language, isInitialized } = useLanguage();

  useEffect(() => {
    if (isInitialized) {
      const title = language === 'zh' ? zhTitle : enTitle;
      document.title = title;
    }
  }, [language, isInitialized, zhTitle, enTitle]);

  return null;
}
