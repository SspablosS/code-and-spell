import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!token) {
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
              fontSize: '1.5rem',
              textAlign: 'center',
              marginBottom: '1rem',
            }}
          >
            Недействительная ссылка
          </h1>
          <p
            style={{
              color: '#64748b',
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            Ссылка для сброса пароля недействительна или истекла.
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="btn-magic-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem' }}
          >
            Запросить новую ссылку
          </button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('/api/auth/reset-password', { token, newPassword });
      navigate('/login', { state: { message: 'Пароль успешно изменен' } });
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Ошибка сброса пароля');
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
            fontSize: '1.5rem',
            textAlign: 'center',
            marginBottom: '0.5rem',
          }}
        >
          Новый пароль
        </h1>
        <p
          style={{
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Введите новый пароль
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
            Новый пароль
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="magic-input"
            style={{ marginBottom: '1.25rem' }}
            placeholder="••••••••"
            required
            minLength={6}
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
            Подтвердите пароль
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="magic-input"
            style={{ marginBottom: '1.25rem' }}
            placeholder="••••••••"
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="btn-magic-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem', marginTop: '0.5rem', opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Загрузка...' : 'Изменить пароль'}
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
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#fbbf24', fontWeight: 600, cursor: 'pointer' }}
          >
            Вернуться к входу
          </span>
        </p>
      </div>
    </div>
  );
}
