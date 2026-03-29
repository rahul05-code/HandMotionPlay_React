import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import "../../styles/common.css";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="toggle-wrapper" onClick={toggleTheme}>
      <div className={`toggle-switch ${theme}`}>
        <div className="toggle-circle">
          {theme === "dark" ? "🌙" : "☀️"}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;