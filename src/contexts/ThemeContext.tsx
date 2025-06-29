
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // We need to ensure useState is called inside a function component body
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      // Only access localStorage in browser environment
      const savedTheme = localStorage.getItem("theme") as Theme;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return savedTheme || (prefersDark ? "dark" : "dark");
    }
    // Default for SSR
    return "dark";
  });

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      if (typeof window !== 'undefined') {
        localStorage.setItem("theme", newTheme);
      }
      return newTheme;
    });
  };

  // Update the document when theme changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
