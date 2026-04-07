import { useEffect, useState } from "react";

const THEME_KEY = "theme";

export function useDarkMode() {
  const [isDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    window.localStorage.setItem(THEME_KEY, "light");
  }, []);

  const toggleDarkMode = () => {};

  return [isDarkMode, toggleDarkMode] as const;
}
