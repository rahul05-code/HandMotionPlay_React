import { Link, useLocation } from "react-router-dom";
import { Hand, Sun, Moon } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

/**
 * AdminNavbar features a distinct set of navigation links for administrative purposes.
 * It matches the provided UI screenshot, including specific styling for active links
 * and a prominent red Logout button.
 */
const AdminNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  return (
    <nav className="navbar" style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)',
      background: 'var(--card-bg)',
      position: 'sticky', top: 0, zIndex: 50, width: '100%'
    }}>
      {/* Brand Logo */}
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--text-main)' }}>
        <div style={{ background: 'rgba(0, 136, 255, 0.1)', padding: '0.2rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Hand size={24} color="var(--primary)" />
        </div>
        <span>HandMotion <span style={{ color: "var(--primary)" }}>Play</span></span>
      </div>

      {/* Admin Navigation Links */}
      <div className="nav-links" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
         <Link 
            to="/admin/dashboard" 
            style={{ 
                padding: '0.5rem 1.25rem', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: currentPath === '/admin/dashboard' ? 'white' : 'var(--text-main)',
                backgroundColor: currentPath === '/admin/dashboard' ? '#0088ff' : 'transparent',
                border: currentPath === '/admin/dashboard' ? 'none' : '1px solid var(--border-color)',
                textDecoration: 'none',
                transition: 'all 0.2sease'
            }}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/users" 
            style={{ 
                padding: '0.5rem 1.25rem', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: currentPath === '/admin/users' ? 'white' : 'var(--text-main)',
                backgroundColor: currentPath === '/admin/users' ? '#0088ff' : 'transparent',
                border: currentPath === '/admin/users' ? 'none' : '1px solid var(--border-color)',
                textDecoration: 'none',
                transition: 'all 0.2sease'
            }}
          >
            Manage User
          </Link>
          <Link 
            to="/admin/games" 
            style={{ 
                padding: '0.5rem 1.25rem', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: currentPath === '/admin/games' ? 'white' : 'var(--text-main)',
                backgroundColor: currentPath === '/admin/games' ? '#0088ff' : 'transparent',
                border: currentPath === '/admin/games' ? 'none' : '1px solid var(--border-color)',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
            }}
          >
             Manage Games
          </Link>
          <Link 
            to="/admin/analytics" 
            style={{ 
                padding: '0.5rem 1.25rem', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: currentPath === '/admin/analytics' ? 'white' : 'var(--text-main)',
                backgroundColor: currentPath === '/admin/analytics' ? '#0088ff' : 'transparent',
                border: currentPath === '/admin/analytics' ? 'none' : '1px solid var(--border-color)',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
            }}
          >
            Analytics
          </Link>

          {/* Theme Toggle */}
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
                padding: '0.5rem',
                marginLeft: 'auto'
            }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Logout Button */}
          <button 
             onClick={() => { window.location.href = '/' }} 
             style={{ 
                padding: '0.5rem 1.5rem', 
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: 'white',
                backgroundColor: 'var(--danger)',
                border: 'none',
                cursor: 'pointer',
                marginLeft: '0.5rem'
            }}
          >
            Logout
          </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
