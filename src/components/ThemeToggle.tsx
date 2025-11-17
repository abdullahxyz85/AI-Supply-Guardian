import { Palette } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative group overflow-hidden rounded-xl p-2.5 transition-all duration-300 hover:scale-105 bg-gray-800/50 border border-gray-700/50 hover:border-primary/50"
      title={`Switch to ${theme === "purple" ? "ArcFi" : "Purple"} theme`}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-primary/10 blur-xl"></div>
      </div>

      {/* Icon and theme indicators */}
      <div className="relative flex items-center space-x-2">
        <Palette className="w-5 h-5 text-primary transition-transform group-hover:rotate-12" />

        {/* Theme dots */}
        <div className="flex space-x-1.5">
          {/* Purple theme dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              theme === "purple"
                ? "bg-purple-500 ring-2 ring-purple-400 shadow-lg shadow-purple-500/50"
                : "bg-purple-500/30"
            }`}
          ></div>

          {/* ArcFi/Orange theme dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              theme === "arcfi"
                ? "bg-orange-500 ring-2 ring-orange-400 shadow-lg shadow-orange-500/50"
                : "bg-orange-500/30"
            }`}
          ></div>
        </div>
      </div>
    </button>
  );
}
