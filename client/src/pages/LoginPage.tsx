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
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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

  const inputStyle = {
    width: '100%',
    backgroundColor: '#0f172a',
    border: '1px solid #2a3a6a',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    marginBottom: '1.25rem',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1A1A2E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#16213E',
          borderRadius: '16px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '420px',
          border: '1px solid #2a3a6a',
          boxShadow: '0 0 40px rgba(107,78,230,0.1)',
        }}
      >
        <h1
          style={{
            color: 'white',
            fontSize: '1.75rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}
        >
          Вход в игру
        </h1>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.9rem',
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
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            style={{
              ...inputStyle,
              borderColor: emailFocused ? '#6B4EE6' : '#2a3a6a',
            }}
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
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            style={{
              ...inputStyle,
              borderColor: passwordFocused ? '#6B4EE6' : '#2a3a6a',
            }}
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#6B4EE6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              opacity: isLoading ? 0.6 : 1,
            }}
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
            color: '#94a3b8',
            fontSize: '0.85rem',
            textAlign: 'center',
            marginTop: '1.5rem',
          }}
        >
          Нет аккаунта?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: '#6B4EE6', fontWeight: 600, cursor: 'pointer' }}
          >
            Зарегистрироваться
          </span>
        </p>
      </div>
    </div>
  );
}
