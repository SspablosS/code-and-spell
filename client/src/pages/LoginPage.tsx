import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { login } from '@/services/auth.service';
import { loginSchema } from '@/schemas/auth.schemas';

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      loginSchema.parse({ email, password });
    } catch {
      setError('Проверьте введённые данные');
      return;
    }

    setIsLoading(true);
    try {
      const response = await login({ email, password });
      setUser(response.user);
      navigate('/levels');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  }

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
          Вход в игру
        </h1>
        <p
          style={{
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Продолжи своё приключение
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn-magic-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem', marginTop: '0.5rem', opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </button>

          {error && (
            <p
              style={{
                color: '#F38181',
                fontSize: '0.85rem',
                marginTop: '0.75rem',
                textAlign: 'center',
              }}
            >
              {error}
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
          Нет аккаунта?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: '#fbbf24', fontWeight: 600, cursor: 'pointer' }}
          >
            Зарегистрироваться
          </span>
        </p>
      </div>
    </div>
  );
}
