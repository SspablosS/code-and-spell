import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LevelCard from '../components/levels/LevelCard';
import { getLevels } from '../services/levels.service';
import { getMyProgress } from '../services/progress.service';
import type { Level, UserProgress } from '../types';

export default function LevelsPage() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [levelsResponse, progressResponse] = await Promise.all([
          getLevels(),
          getMyProgress(),
        ]);
        setLevels(levelsResponse.levels);
        setProgress(progressResponse.progress);
      } catch {
        setError('Не удалось загрузить уровни');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const getLevelProgress = (levelId: number) => {
    return progress.find((p) => p.levelId === levelId);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '2rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.25rem',
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#16213E',
                borderRadius: '14px',
                height: '200px',
                border: '1px solid #2a3a6a',
                animation: 'pulse 1.5s infinite',
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#1A1A2E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#F38181',
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <h1
        style={{
          color: 'white',
          fontSize: '1.75rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}
      >
        Выбери уровень
      </h1>
      <p
        style={{
          color: '#94a3b8',
          marginBottom: '2rem',
        }}
      >
        Реши головоломки и обучи своего голема
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.25rem',
        }}
      >
        {levels.map((level) => {
          const levelProgress = getLevelProgress(level.id);
          const isCompleted = levelProgress?.isCompleted || false;

          return (
            <LevelCard
              key={level.id}
              level={level}
              isCompleted={isCompleted}
              onClick={() => navigate(`/level/${level.id}`)}
            />
          );
        })}
      </div>
    </div>
  );
}
