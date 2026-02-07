"use client";

import { useState } from "react";

interface ApiKeyCheckProps {
  children: React.ReactNode;
}

const ApiKeyMissingAlert = () => (
  <div className="mb-4 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
    <p className="mb-3 text-sm sm:text-base">To get started, you need to initialize Tambo:</p>
    <div className="flex items-center gap-2 bg-gray-100 p-2.5 sm:p-3 rounded mb-3">
      <code className="text-xs sm:text-sm flex-grow break-all">npx tambo init</code>
      <CopyButton text="npx tambo init" />
    </div>
    <p className="text-xs sm:text-sm leading-relaxed">
      Or visit{" "}
      <a
        href="https://tambo.co/cli-auth"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-yellow-900 break-words"
      >
        tambo.co/cli-auth
      </a>{" "}
      to get your API key and set it in{" "}
      <code className="bg-yellow-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
        .env.local
      </code>
    </p>
  </div>
);

const CopyButton = ({ text }: { text: string }) => {
  const [showCopied, setShowCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="p-2 text-gray-600 hover:text-gray-900 active:text-gray-700 bg-gray-100 rounded transition-colors relative group min-w-[36px] min-h-[36px] flex items-center justify-center"
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
    >
      {showCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {showCopied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
};

export function ApiKeyCheck({ children }: ApiKeyCheckProps) {
  const isApiKeyMissing = !process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  return (
    <div className="flex items-start gap-2 sm:gap-4">
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="min-w-[24px] text-lg sm:text-xl flex-shrink-0">
            {isApiKeyMissing ? "❌" : "✅"}
          </div>
          <p className="text-sm sm:text-base">
            {isApiKeyMissing ? "Tambo not initialized" : "Tambo initialized"}
          </p>
        </div>
        {isApiKeyMissing && <ApiKeyMissingAlert />}
        {!isApiKeyMissing && children}
      </div>
    </div>
  );
}
