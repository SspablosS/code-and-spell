import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  // Временно закомментировано для тестирования лендинга
  // const user = useAuthStore((state) => state.user);
  // useEffect(() => {
  //   if (user) {
  //     navigate('/levels');
  //   }
  // }, [user, navigate]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1A1A2E', color: 'white' }}>
      {/* Hero секция */}
      <div style={{ textAlign: 'center', padding: '5rem 1.5rem 3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚗️</div>
        <h1
          style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Code & Spell
        </h1>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '1.2rem',
            maxWidth: '500px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}
        >
          Учись программировать, управляя магическим големом
        </p>

        {/* Кнопки */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              backgroundColor: '#6B4EE6',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 32px',
              fontSize: '1.05rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Начать приключение
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              backgroundColor: 'transparent',
              color: '#94a3b8',
              border: '1px solid #2a3a6a',
              borderRadius: '10px',
              padding: '14px 32px',
              fontSize: '1.05rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Уже есть аккаунт
          </button>
        </div>
      </div>

      {/* Секция фич */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
          maxWidth: '900px',
          margin: '4rem auto 0',
          padding: '0 1.5rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#16213E',
            borderRadius: '14px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            border: '1px solid #2a3a6a',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧙</div>
          <div
            style={{ color: 'white', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem' }}
          >
            Пиши заклинания
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Управляй големом на псевдокоде похожем на Python
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#16213E',
            borderRadius: '14px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            border: '1px solid #2a3a6a',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
          <div
            style={{ color: 'white', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem' }}
          >
            Запускай голема
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Смотри как твой код оживает на игровом поле
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#16213E',
            borderRadius: '14px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            border: '1px solid #2a3a6a',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏆</div>
          <div
            style={{ color: 'white', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.5rem' }}
          >
            Решай головоломки
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6 }}>
            5 уровней с возрастающей сложностью
          </div>
        </div>
      </div>
    </div>
  );
}
