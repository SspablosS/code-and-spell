import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { register } from '@/services/auth.service';
import { registerSchema } from '@/schemas/auth.schemas';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    try {
      const data = registerSchema.parse({ email, username, password });
      setIsLoading(true);
      const response = await register(data);
      setUser(response.user);
      navigate('/levels');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'issues' in err) {
        const fieldErrors: { [key: string]: string } = {};
        (err as { issues: { path: string[]; message: string }[] }).issues.forEach((issue) => {
          const field = issue.path[0];
          if (field) {
            fieldErrors[field] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: 'Ошибка регистрации' });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const errorStyle = {
    color: '#F38181',
    fontSize: '0.78rem',
    marginTop: '-1rem',
    marginBottom: '0.75rem',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--darker)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="magic-card"
        style={{ padding: '2.5rem', width: '100%', maxWidth: '420px', boxShadow: '0 0 50px rgba(108,99,255,0.12)' }}
      >
        <h1
          className="magic-title"
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '1.75rem',
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}
        >
          Создать аккаунт
        </h1>
        <p
          style={{
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Начни своё магическое путешествие
        </p>

        <form onSubmit={handleSubmit}>
          <label
            style={{
              color: '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 500,
              marginBottom: '0.4rem',
              display: 'block',
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="magic-input"
            style={{ marginBottom: '1.25rem' }}
            placeholder="your@email.com"
            required
          />
          {errors.email && <p style={errorStyle}>{errors.email}</p>}

          <label
            style={{
              color: '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 500,
              marginBottom: '0.4rem',
              display: 'block',
            }}
          >
            Имя пользователя
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="magic-input"
            style={{ marginBottom: '1.25rem' }}
            placeholder="username"
            required
          />
          {errors.username && <p style={errorStyle}>{errors.username}</p>}

          <label
            style={{
              color: '#94a3b8',
              fontSize: '0.85rem',
              fontWeight: 500,
              marginBottom: '0.4rem',
              display: 'block',
            }}
          >
            Пароль
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="magic-input"
            style={{ marginBottom: '1.25rem' }}
            placeholder="••••••••"
            required
          />
          {errors.password && <p style={errorStyle}>{errors.password}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-magic-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem', marginTop: '0.5rem', opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>

          {errors.general && (
            <p
              style={{
                color: '#F38181',
                fontSize: '0.85rem',
                marginTop: '0.75rem',
                textAlign: 'center',
              }}
            >
              {errors.general}
            </p>
          )}
        </form>

        <p
          style={{
            color: '#64748b',
            fontSize: '0.85rem',
            textAlign: 'center',
            marginTop: '1.5rem',
          }}
        >
          Уже есть аккаунт?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#fbbf24', fontWeight: 600, cursor: 'pointer' }}
          >
            Войти
          </span>
        </p>
      </div>
    </div>
  );
}
