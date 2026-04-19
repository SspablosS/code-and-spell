import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { getStats, getMyProgress } from '@/services/progress.service';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { UserProgress } from '@/types';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<{ completedLevels: number; totalAttempts: number } | null>(null);
  const [progress, setProgress] = useState<UserProgress[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsResponse, progressResponse] = await Promise.all([
          getStats(),
          getMyProgress(),
        ]);
        setStats(statsResponse.stats);
        setProgress(progressResponse.progress);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  const completedLevels = progress.filter((p) => p.isCompleted);

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      {/* Шапка профиля */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#6B4EE6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'white',
          }}
        >
          {user?.username[0].toUpperCase()}
        </div>
        <div>
          <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>{user?.username}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>{user?.email}</div>
        </div>
      </div>

      {/* Карточки статистики */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div
          style={{
            backgroundColor: '#16213E',
            borderRadius: '12px',
            padding: '1.25rem 1.75rem',
            border: '1px solid #2a3a6a',
            flex: 1,
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6B4EE6' }}>{stats?.completedLevels ?? 0}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>Пройдено уровней</div>
        </div>
        <div
          style={{
            backgroundColor: '#16213E',
            borderRadius: '12px',
            padding: '1.25rem 1.75rem',
            border: '1px solid #2a3a6a',
            flex: 1,
          }}
        >
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6B4EE6' }}>{stats?.totalAttempts ?? 0}</div>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.25rem' }}>Попыток</div>
        </div>
      </div>

      {/* Заголовок секции списка */}
      <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
        Пройденные уровни
      </div>

      {/* Список пройденных уровней */}
      {completedLevels.length > 0 ? (
        completedLevels.map((p) => (
          <div
            key={p.levelId}
            style={{
              backgroundColor: '#16213E',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              marginBottom: '0.75rem',
              border: '1px solid #2a3a6a',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#97e195', fontWeight: 700, marginRight: '0.75rem' }}>✓</span>
              <span style={{ color: 'white', fontWeight: 500 }}>Уровень {p.levelId}</span>
            </div>
            {p.completedAt && (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                {new Date(p.completedAt).toLocaleDateString('ru-RU')}
              </div>
            )}
          </div>
        ))
      ) : (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>Ты ещё не прошёл ни одного уровня. Начни прямо сейчас! 🧙</div>
          <button
            onClick={() => navigate('/levels')}
            style={{
              backgroundColor: '#6B4EE6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            К уровням
          </button>
        </div>
      )}
    </div>
  );
}
