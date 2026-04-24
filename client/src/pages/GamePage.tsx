import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameCanvas from '../components/game/GameCanvas';
import CodeEditor from '../components/game/CodeEditor';
import GameControls from '../components/game/GameControls';
import HintsPanel from '../components/game/HintsPanel';
import { useGameStore } from '../store/game.store';
import { useGolemAnimation } from '../hooks/useGolemAnimation';
import { getLevelById } from '../services/levels.service';
import { upsertProgress, getMyProgress } from '../services/progress.service';
import { runCode } from '../interpreter';
import type { GameStep } from '../types';

export default function GamePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animationSteps, setAnimationSteps] = useState<GameStep[]>([]);
  const [attemptsCount, setAttemptsCount] = useState(0);

  const {
    currentLevel,
    golemState,
    code,
    isRunning,
    isCompleted,
    isFailed,
    setLevel,
    setCode,
    setRunning,
    setCompleted,
    setGolemState,
    applyStep,
    reset,
  } = useGameStore();

  const handleStepApplied = useCallback((step: GameStep) => {
    applyStep(step);
  }, [applyStep]);

  const handleAnimationComplete = useCallback(async (completed: boolean, steps: GameStep[]) => {
    setRunning(false);
    setAnimationSteps([]);

    const errorStep = steps.find(step => step.type === 'error');

    if (completed) {
      setCompleted(true);
      if (currentLevel) {
        await upsertProgress(currentLevel.id, {
          isCompleted: true,
          bestSolution: code,
          attemptsCount: attemptsCount,
        });
      }
    } else {
      setTimeout(() => {
        if (currentLevel) {
          setGolemState(currentLevel.initialState.golem);
          setRunning(false);
          setCompleted(false);
          setError(errorStep?.message || 'Цель не достигнута. Попробуй ещё раз!');
        }
      }, 600);
    }
  }, [currentLevel, code, setRunning, setCompleted, setGolemState, attemptsCount]);

  useGolemAnimation({
    steps: animationSteps,
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

        // Загружаем прогресс для текущего уровня
        const progressResponse = await getMyProgress();
        const levelProgress = progressResponse.progress.find(p => p.levelId === Number(id));
        if (levelProgress) {
          setAttemptsCount(levelProgress.attemptsCount);
        } else {
          setAttemptsCount(0);
        }
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
      // Установить golemState из initialState уровня
      setGolemState(currentLevel.initialState.golem);
    }
  }, [currentLevel, setGolemState]);

  const handleRun = async () => {
    if (!currentLevel) return;

    // Проверка на пустой код
    if (!code || code.trim() === '') {
      setError('Напиши заклинание прежде чем запускать голема!');
      return;
    }

    setRunning(true);
    setError(null);
    setCompleted(false);

    // Увеличиваем счётчик попыток СРАЗУ при запуске
    const newAttempts = attemptsCount + 1;
    setAttemptsCount(newAttempts);

    // Сохраняем попытку немедленно (без isCompleted)
    await upsertProgress(currentLevel.id, {
      isCompleted: false,
      attemptsCount: newAttempts,
    });

    const levelContext = {
      gridSize: currentLevel.gridSize,
      crystal: currentLevel.initialState.crystal,
      obstacles: currentLevel.initialState.obstacles,
      goal: currentLevel.goalState,
    };

    const result = runCode(code, currentLevel.initialState.golem, levelContext);

    // Синтаксическая ошибка (нет шагов вообще) — показать сразу
    if (result.error && result.steps.length === 0) {
      setError(result.error);
      setRunning(false);
      return;
    }

    // Есть шаги (включая runtime ошибки типа столкновения) — запускаем анимацию
    // result.error будет обработан в handleAnimationComplete через error-шаги
    setAnimationSteps(result.steps);
  };

  const handleReset = () => {
    setAnimationSteps([]);
    if (currentLevel) {
      setGolemState(currentLevel.initialState.golem);
    }
    setRunning(false);
    setCompleted(false);
    setError(null);
  };

  const handleNextLevel = () => {
    if (currentLevel) {
      const nextLevelId = currentLevel.id + 1;
      navigate(`/level/${nextLevelId}`);
    }
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
              onNextLevel={handleNextLevel}
              isRunning={isRunning}
              isCompleted={isCompleted}
              isFailed={isFailed}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
