import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check local storage for saved theme, otherwise default to dark
    const savedTheme = localStorage.getItem("handmotion-theme");
    return savedTheme ? savedTheme : "dark";
  });

  useEffect(() => {
    // Apply theme class to body for global styling
    document.body.className = theme;
    // Persist choice to local storage
    localStorage.setItem("handmotion-theme", theme);
    // Add to document element for any data-theme attributes (optional fallback)
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update favicon depending on the theme
    const favicon = document.getElementById("app-favicon");
    if (favicon) {
      favicon.href = theme === "dark" ? "/logo2.png" : "/logo.png";
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};