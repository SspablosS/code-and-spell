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

  const navStyle = {
    position: 'fixed' as const,
    top: 0,
    width: '100%',
    zIndex: 1000,
    background: 'rgba(8,8,16,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(108,99,255,0.2)',
    padding: '18px 60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyle = {
    fontFamily: 'Cinzel, serif',
    fontSize: '1.3rem',
    color: '#fbbf24',
    textDecoration: 'none' as const,
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  };

  const logoIconStyle = {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    boxShadow: '0 0 15px rgba(108,99,255,0.5)',
  };

  const linkStyle = {
    color: '#94a3b8',
    fontWeight: 500,
    textDecoration: 'none' as const,
    position: 'relative' as const,
  };

  const linkHoverStyle = {
    color: '#fbbf24',
  };

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <Link to="/" style={logoStyle}>
        <div style={logoIconStyle}>🔮</div>
        <span>Code & Spell</span>
      </Link>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {user ? (
          <>
            <Link
              to="/levels"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = linkHoverStyle.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = linkStyle.color;
              }}
            >
              Уровни
            </Link>
            <Link
              to="/profile"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = linkHoverStyle.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = linkStyle.color;
              }}
            >
              Профиль
            </Link>
            <button onClick={handleLogout} className="btn-magic-outline">
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={linkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = linkHoverStyle.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = linkStyle.color;
              }}
            >
              Войти
            </Link>
            <Link to="/register" className="btn-magic-primary">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
