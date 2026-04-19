import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { logout } from '@/services/auth.service';

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const authLogout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      authLogout();
      navigate('/login');
    } catch {
      authLogout();
      navigate('/login');
    }
  }

  const linkStyle = {
    color: '#94a3b8',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'color 0.2s',
  };

  const linkHoverStyle = {
    color: '#ffffff',
  };

  const buttonStyle = {
    backgroundColor: '#6B4EE6',
    color: 'white',
    padding: '6px 18px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  };

  const buttonHoverStyle = {
    backgroundColor: '#5a3dd4',
  };

  return (
    <nav style={{ backgroundColor: '#16213E', borderBottom: '1px solid #2a3a6a' }} className="px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl" role="img" aria-label="Potion">
          ⚗️
        </span>
        <span
          style={{
            fontFamily: 'Inter',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: '#a78bfa',
            letterSpacing: '-0.02em',
          }}
        >
          Code & Spell
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        {user ? (
          <>
            <Link
              to="/levels"
              style={linkStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = linkHoverStyle.color}
              onMouseLeave={(e) => e.currentTarget.style.color = linkStyle.color}
            >
              Уровни
            </Link>
            <Link
              to="/profile"
              style={linkStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = linkHoverStyle.color}
              onMouseLeave={(e) => e.currentTarget.style.color = linkStyle.color}
            >
              Профиль
            </Link>
            <button
              onClick={handleLogout}
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={linkStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = linkHoverStyle.color}
              onMouseLeave={(e) => e.currentTarget.style.color = linkStyle.color}
            >
              Войти
            </Link>
            <Link
              to="/register"
              style={buttonStyle}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor}
            >
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
