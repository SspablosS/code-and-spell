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
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
            boxShadow: '0 0 25px rgba(108,99,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Cinzel, serif',
            fontSize: '1.75rem',
            color: 'white',
          }}
        >
          {user?.username[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '1.5rem', color: '#e0e7ff' }}>{user?.username}</div>
          <div style={{ color: '#64748b', marginTop: '0.25rem' }}>{user?.email}</div>
        </div>
      </div>

      {/* Карточки статистики */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="magic-card" style={{ padding: '1.25rem 1.75rem', flex: 1 }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem', color: '#fbbf24' }}>{stats?.completedLevels ?? 0}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>Пройдено уровней</div>
        </div>
        <div className="magic-card" style={{ padding: '1.25rem 1.75rem', flex: 1 }}>
          <div style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem', color: '#fbbf24' }}>{stats?.totalAttempts ?? 0}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>Попыток</div>
        </div>
      </div>

      {/* Заголовок секции списка */}
      <div className="magic-title" style={{ fontFamily: 'Cinzel, serif', fontSize: '1.1rem', marginBottom: '1rem' }}>
        Пройденные уровни
      </div>

      {/* Список пройденных уровней */}
      {completedLevels.length > 0 ? (
        completedLevels.map((p) => (
          <div
            key={p.levelId}
            className="magic-card"
            style={{ padding: '1rem 1.25rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ color: '#10b981', fontWeight: 700, marginRight: '0.75rem' }}>✓</span>
              <span style={{ color: '#e0e7ff', fontWeight: 500 }}>Уровень {p.levelId}</span>
            </div>
            {p.completedAt && (
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                {new Date(p.completedAt).toLocaleDateString('ru-RU')}
              </div>
            )}
          </div>
        ))
      ) : (
        <div style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>Ты ещё не прошёл ни одного уровня. Начни прямо сейчас! 🧙</div>
          <button onClick={() => navigate('/levels')} className="btn-magic-primary">
            К уровням
          </button>
        </div>
      )}
    </div>
  );
}
