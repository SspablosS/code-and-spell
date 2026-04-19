import { useState } from 'react';

interface HintsPanelProps {
  hints: string[];
}

export default function HintsPanel({ hints }: HintsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          backgroundColor: '#16213E',
          border: '1px solid #2a3a6a',
          borderRadius: isOpen ? '8px 8px 0 0' : '8px',
          padding: '10px 14px',
          color: '#FFE66D',
          fontWeight: 500,
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '0.9rem',
          marginTop: '1rem',
        }}
      >
        {isOpen ? '💡 Скрыть подсказки' : `💡 Подсказки (${hints.length})`}
      </button>

      {isOpen && (
        <div
          style={{
            backgroundColor: '#16213E',
            border: '1px solid #2a3a6a',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            padding: '0.75rem 1rem',
          }}
        >
          {hints.map((hint, index) => (
            <div
              key={index}
              style={{
                color: '#94a3b8',
                fontSize: '0.875rem',
                padding: '0.4rem 0',
                borderBottom: index < hints.length - 1 ? '1px solid #1e2a4a' : 'none',
              }}
            >
              → {hint}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
