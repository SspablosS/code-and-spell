import type { Level } from '../../types';

interface LevelCardProps {
  level: Level;
  isCompleted: boolean;
  onClick: () => void;
}

export default function LevelCard({ level, isCompleted, onClick }: LevelCardProps) {
  const difficultyEmoji: Record<string, string> = {
    easy: '🌱',
    medium: '⚔️',
    hard: '🔥',
  };

  const difficultyClass: Record<string, string> = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
  };

  return (
    <div
      onClick={onClick}
      className="magic-card"
      style={{ padding: '1.75rem', cursor: 'pointer', position: 'relative' }}
    >
      {isCompleted && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.4)',
            borderRadius: '50%',
            width: 28,
            height: 28,
            color: '#10b981',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
          }}
        >
          ✓
        </div>
      )}

      <div
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '2.2rem',
          fontWeight: 700,
          color: '#fbbf24',
          marginBottom: '0.5rem',
        }}
      >
        #{level.orderIndex}
      </div>

      <div
        style={{
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#e0e7ff',
          marginBottom: '0.75rem',
        }}
      >
        {level.title}
      </div>

      <div
        className={`difficulty-badge ${difficultyClass[level.difficulty || 'easy']}`}
        style={{ marginBottom: '1.25rem' }}
      >
        {difficultyEmoji[level.difficulty || 'easy']} {level.difficulty || 'easy'}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={isCompleted ? 'btn-magic-outline' : 'btn-magic-primary'}
        style={{
          width: '100%',
          marginTop: '1.25rem',
          ...(isCompleted ? { color: '#10b981', borderColor: '#10b981' } : {}),
        }}
      >
        {isCompleted ? '✓ Пройден' : '▶ Играть'}
      </button>
    </div>
  );
}
