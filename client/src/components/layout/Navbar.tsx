import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

  return (
    <nav className="bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Potion">
              🧪
            </span>
            <span className="text-xl font-bold text-foreground tracking-tight">
              Code & Spell
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/levels"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Уровни
                </Link>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Профиль
                </Link>
                <Button size="sm" className="font-medium" onClick={handleLogout}>
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
