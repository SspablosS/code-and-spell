import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GameCanvas from '../components/game/GameCanvas';
import CodeEditor from '../components/game/CodeEditor';
import GameControls from '../components/game/GameControls';
import HintsPanel from '../components/game/HintsPanel';
import { useGameStore } from '../store/game.store';
import { useGolemAnimation } from '../hooks/useGolemAnimation';
import { getLevelById } from '../services/levels.service';
import { upsertProgress } from '../services/progress.service';
import { runCode } from '../interpreter';
import type { GameStep } from '../types';

export default function GamePage() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    currentLevel,
    golemState,
    code,
    isRunning,
    isCompleted,
    isFailed,
    errorMessage,
    steps,
    setLevel,
    setCode,
    setRunning,
    applyStep,
    reset,
  } = useGameStore();

  const handleStepApplied = (step: GameStep) => {
    applyStep(step);
  };

  const handleAnimationComplete = (completed: boolean) => {
    setRunning(false);
    if (completed) {
      // Сохранить прогресс
      if (currentLevel) {
        upsertProgress(currentLevel.id, {
          isCompleted: true,
          bestSolution: code,
          attemptsCount: 1,
        });
      }
    }
  };

  useGolemAnimation({
    steps,
    isCompleted,
    onStepApplied: handleStepApplied,
    onAnimationComplete: handleAnimationComplete,
  });

  useEffect(() => {
    async function loadLevel() {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getLevelById(Number(id));
        setLevel(response.level);
        setCode('');
        reset();
      } catch {
        setError('Не удалось загрузить уровень');
      } finally {
        setIsLoading(false);
      }
    }

    loadLevel();
  }, [id, setLevel, setCode, reset]);

  useEffect(() => {
    if (currentLevel) {
      // Сбросить golemState при смене уровня
      reset();
    }
  }, [currentLevel, reset]);

  const handleRun = () => {
    if (!currentLevel) return;

    setRunning(true);
    setError(null);

    const levelContext = {
      gridSize: currentLevel.gridSize,
      crystal: currentLevel.initialState.crystal,
      obstacles: currentLevel.initialState.obstacles,
      goal: currentLevel.goalState,
    };

    const result = runCode(code, currentLevel.initialState.golem, levelContext);

    if (result.error) {
      setError(result.error);
      setRunning(false);
    }
  };

  const handleReset = () => {
    reset();
    setError(null);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#1A1A2E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            color: '#6B4EE6',
            fontSize: '1.1rem',
            fontWeight: 500,
          }}
        >
          ⚗️ Загружаем уровень...
        </span>
      </div>
    );
  }

  if (!currentLevel) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#1A1A2E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        Уровень не найден
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          {currentLevel.title}
        </h1>
        {currentLevel.description && (
          <p
            style={{
              color: '#94a3b8',
              fontSize: '0.9rem',
              marginTop: '0.25rem',
            }}
          >
            {currentLevel.description}
          </p>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          alignItems: 'start',
        }}
      >
        {/* Левая колонка: Canvas + подсказки */}
        <div>
          <div
            style={{
              color: '#94a3b8',
              fontSize: '0.8rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
            }}
          >
            Игровое поле
          </div>
          <div
            style={{
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 0 30px rgba(107,78,230,0.15)',
            }}
          >
            <GameCanvas level={currentLevel} golemState={golemState} isAnimating={isRunning} />
          </div>
          <HintsPanel hints={[]} />
        </div>

        {/* Правая колонка: редактор + контролы */}
        <div>
          <div
            style={{
              color: '#94a3b8',
              fontSize: '0.8rem',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
            }}
          >
            Заклинание
          </div>
          <CodeEditor value={code} onChange={setCode} disabled={isRunning} />
          <div style={{ marginTop: '1rem' }}>
            <GameControls
              onRun={handleRun}
              onReset={handleReset}
              isRunning={isRunning}
              isCompleted={isCompleted}
              isFailed={isFailed}
              error={errorMessage || error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
