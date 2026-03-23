import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Hand, Home, Gamepad2, LineChart, UserCircle, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  const isAuthPage = currentPath === '/login' || currentPath === '/register';

  return (
    <nav className="navbar" style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)',
      background: 'var(--card-bg)',
      position: 'sticky', top: 0, zIndex: 50, width: '100%'
    }}>
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--text-main)' }}>
        <Hand size={28} color="var(--primary)" />
        <span>HandMotion <span style={{ color: "var(--primary)" }}>Play</span></span>
      </div>

      {!isAuthPage && (
        <div className="nav-links" style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" className={`nav-pill ${currentPath === '/' ? 'active' : ''}`}>
            <Home size={18} /> Home
          </Link>
          <Link to="/games" className={`nav-pill ${currentPath.includes('/games') ? 'active' : ''}`}>
            <Gamepad2 size={18} /> Games
          </Link>
          <Link to="/progress" className={`nav-pill ${currentPath === '/progress' ? 'active' : ''}`}>
            <LineChart size={18} /> Progress
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={toggleTheme}
          style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem'
          }}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {!isAuthPage ? (
          <Link to="/profile" style={{ textDecoration: 'none', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
            <UserCircle size={32} strokeWidth={1.5} />
          </Link>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" className={`btn ${currentPath === '/login' ? 'btn-outline' : 'btn-primary'}`} style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
              Login
            </Link>
            <Link to="/register" className={`btn ${currentPath === '/register' ? 'btn-outline' : 'btn-primary'}`} style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;