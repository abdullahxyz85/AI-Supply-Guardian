import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "arcfi" | "purple";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("supply-guardian-theme");
    return (saved as Theme) || "purple";
  });

  useEffect(() => {
    localStorage.setItem("supply-guardian-theme", theme);

    // Apply theme class to body
    document.body.classList.remove("theme-arcfi", "theme-purple");
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "purple" ? "arcfi" : "purple"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
