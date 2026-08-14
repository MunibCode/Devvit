"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-inputGray flex items-center gap-4"
      aria-label="Toggle theme"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={isDark ? "fill-iconBlue" : "fill-textGrayLight"}
      >
        {isDark ? (
          <path d="M12 3v-1h-2v1h2zm6 3c.55.52 1.05 1.1 1.5 1.72l1.38-.72-1-1.73-1.38.72l-.5.01zM12 5c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 2.5c2.49 0 4.5 2.01 4.5 4.5s-2.01 4.5-4.5 4.5-4.5-2.01-4.5-4.5 2.01-4.5 4.5-4.5zM3.71 6.71l-.5.01-1 1.73 1.38.72c.45-.62.95-1.2 1.5-1.72l-.5-.01.01-.5.35-.43-1.01-1.01-.23.21zm.79 4.79H3v2h1.5v-2zm13.5.5h1.5v-2h-1.5v2zM12 2v1.5h2V2h-2z" />
        ) : (
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5c.12-.6-.35-1.2-1.01-1.05A9 9 0 0 0 12 21a9.03 9.03 0 0 0 8.45-5.94c.15-.55-.35-1.02-.95-1.02-.33 0-.66.11-.99.14zM12 19c-2.5 0-4.65-1.4-5.72-3.45 2.85.18 6.63-1.58 8.12-3.4a8.26 8.26 0 0 1 .93 3.9A8.94 8.94 0 0 1 12 19z" />
        )}
      </svg>
      <span className="hidden xxl:inline">Appearance</span>
    </button>
  );
};

export default ThemeToggle;
