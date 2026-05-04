import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const ThemeToggle = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    console.error("ThemeContext is undefined. Wrap your app with ThemeProvider.");
    return null;
  }

  const { theme, toggleTheme } = context;

  return (
    <div onClick={toggleTheme} style={{cursor:"pointer"}}>
      {theme === "dark" ? "🌙" : "☀️"}
    </div>
  );
};

export default ThemeToggle;