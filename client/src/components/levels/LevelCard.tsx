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

  const difficultyColors: Record<string, { bg: string; color: string }> = {
    easy: { bg: '#0f2a1f', color: '#97e195' },
    medium: { bg: '#2a2a0f', color: '#FFE66D' },
    hard: { bg: '#2a0f0f', color: '#F38181' },
  };

  const colors = difficultyColors[level.difficulty || 'easy'];

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#16213E',
        borderRadius: '14px',
        padding: '1.5rem',
        border: isCompleted ? '1px solid #97e195' : '1px solid #2a3a6a',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#6B4EE6';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(107,78,230,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isCompleted ? '#97e195' : '#2a3a6a';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {isCompleted && (
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: '#0f2a1f',
            color: '#97e195',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: 700,
          }}
        >
          ✓
        </div>
      )}

      <div
        style={{
          color: '#6B4EE6',
          fontSize: '2.5rem',
          fontWeight: 800,
          lineHeight: 1,
          marginBottom: '0.5rem',
        }}
      >
        #{level.orderIndex}
      </div>

      <div
        style={{
          color: 'white',
          fontSize: '1.1rem',
          fontWeight: 600,
          marginBottom: '0.75rem',
        }}
      >
        {level.title}
      </div>

      <div
        style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 600,
          backgroundColor: colors.bg,
          color: colors.color,
          marginBottom: '1.25rem',
        }}
      >
        {difficultyEmoji[level.difficulty || 'easy']} {level.difficulty || 'easy'}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        style={{
          width: '100%',
          marginTop: '1.25rem',
          backgroundColor: isCompleted ? '#0f2a1f' : '#6B4EE6',
          color: isCompleted ? '#97e195' : 'white',
          border: isCompleted ? '1px solid #97e195' : 'none',
          borderRadius: '8px',
          padding: '10px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        {isCompleted ? '✓ Пройден' : '▶ Играть'}
      </button>
    </div>
  );
}
