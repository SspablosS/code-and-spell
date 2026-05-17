import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axios.post('/api/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Ошибка отправки');
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
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
            Ссылка отправлена
          </h1>
          <p
            style={{
              color: '#64748b',
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            Ссылка для сброса пароля отправлена на вашу почту. Проверьте папку "Входящие" и "Спам".
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-magic-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem' }}
          >
            Вернуться к входу
          </button>
        </div>
      </div>
    );
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
          Сброс пароля
        </h1>
        <p
          style={{
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Введите email для сброса пароля
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn-magic-primary"
            style={{ width: '100%', padding: '13px', fontSize: '1rem', marginTop: '0.5rem', opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
          >
            {isLoading ? 'Загрузка...' : 'Отправить ссылку'}
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
