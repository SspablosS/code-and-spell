interface GameControlsProps {
  onRun: () => void;
  onReset: () => void;
  onNextLevel: () => void;
  isRunning: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  error: string | null;
}

export default function GameControls({
  onRun,
  onReset,
  onNextLevel,
  isRunning,
  isCompleted,
  isFailed,
  error,
}: GameControlsProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={onRun}
          disabled={isRunning}
          style={{
            flex: 1,
            backgroundColor: isRunning ? '#4a3a8a' : '#6B4EE6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: isRunning ? 'not-allowed' : 'pointer',
            opacity: isRunning ? 0.7 : 1,
            transition: 'all 0.2s',
          }}
        >
          {isRunning ? '⏳ Выполняется...' : '▶ Запустить'}
        </button>
        <button
          onClick={onReset}
          style={{
            backgroundColor: '#1e2a4a',
            color: '#94a3b8',
            border: '1px solid #2a3a6a',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          ↺ Сбросить
        </button>
      </div>

      {isCompleted && (
        <div
          style={{
            backgroundColor: '#0f2a1f',
            border: '1px solid #97e195',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#97e195', fontWeight: 600, fontSize: '1rem' }}>✨ Уровень пройден!</span>
          <button
            style={{
              backgroundColor: '#97e195',
              color: '#0f2a1f',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={onNextLevel}
          >
            Дальше →
          </button>
        </div>
      )}

      {isFailed && !isCompleted && (
        <div
          style={{
            backgroundColor: '#2a0f0f',
            border: '1px solid #F38181',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
          }}
        >
          <span style={{ color: '#F38181', fontWeight: 500 }}>💥 Голем упал! Попробуй ещё раз</span>
        </div>
      )}

      {error && !isFailed && (
        <div
          style={{
            backgroundColor: '#1a0f0f',
            border: '1px solid #F38181',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
          }}
        >
          <span
            style={{
              color: '#F38181',
              fontSize: '0.85rem',
              fontFamily: 'Fira Code, monospace',
            }}
          >
            ⚠ {error}
          </span>
        </div>
      )}
    </div>
  );
}
