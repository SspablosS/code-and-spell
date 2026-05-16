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
  const [showTutorial, setShowTutorial] = useState(false);

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

      // Показать туториал только на уровне 1 и если не был показан
      const tutorialShown = localStorage.getItem('tutorial_shown');
      if (currentLevel.id === 1 && !tutorialShown) {
        setShowTutorial(true);
      }
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

  const handleCloseTutorial = () => {
    localStorage.setItem('tutorial_shown', 'true');
    setShowTutorial(false);
  };

  const levelLessons: Record<number, { concept: string; example: string }> = {
    1: {
      concept: "🧠 Концепция: Последовательность",
      example: "Компьютер выполняет команды строго по порядку, сверху вниз",
    },
    2: {
      concept: "🧠 Концепция: Направление",
      example: "Голем движется туда куда смотрит. Сначала повернись, потом иди",
    },
    3: {
      concept: "🧠 Концепция: Планирование",
      example: "Перед написанием кода — продумай маршрут глазами",
    },
    4: {
      concept: "🧠 Концепция: Цикл (repeat)",
      example: "repeat 3:\n    move()\n\nзначит выполнить move() три раза",
    },
    5: {
      concept: "🧠 Концепция: Алгоритм",
      example: "Алгоритм — точная последовательность шагов для решения задачи",
    },
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
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              border: '2px solid #6c63ff',
              borderRadius: '16px',
              padding: '2.5rem',
              maxWidth: '500px',
              boxShadow: '0 0 40px rgba(108, 99, 255, 0.3)',
            }}
          >
            <h2
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '1.75rem',
                color: '#fbbf24',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              Добро пожаловать, маг! 🧙
            </h2>
            <p
              style={{
                color: '#e0e7ff',
                fontSize: '1rem',
                lineHeight: '1.8',
                marginBottom: '1.5rem',
              }}
            >
              Ты управляешь големом с помощью кода.
              Пиши команды в редакторе справа и нажимай Запустить.
            </p>
            <div
              style={{
                background: 'rgba(108, 99, 255, 0.1)',
                border: '1px solid rgba(108, 99, 255, 0.3)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '0.85rem',
                  marginBottom: '0.75rem',
                  fontWeight: 500,
                }}
              >
                Доступные команды:
              </div>
              <div style={{ color: '#e0e7ff', fontSize: '0.9rem', lineHeight: '1.6' }}>
                <div>move() — шаг вперёд</div>
                <div>collect() — сбор предмета</div>
                <div>turn_left() — поворот налево</div>
                <div>turn_right() — поворот направо</div>
                <div style={{ marginTop: '0.5rem' }}>
                  repeat N: — повтори N раз
                </div>
                <div style={{ marginLeft: '1rem', color: '#94a3b8' }}>
                  команда()
                </div>
              </div>
            </div>
            <button
              onClick={handleCloseTutorial}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #6c63ff, #a855f7)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(108, 99, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(108, 99, 255, 0.4)';
              }}
            >
              Понятно, начинаем!
            </button>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h1
          style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 700,
          }}
        >
          {currentLevel.title}
        </h1>
        <button
          onClick={() => setShowTutorial(true)}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid rgba(108,99,255,0.4)',
            color: '#a78bfa',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          📖 Туториал
        </button>
      </div>
      {currentLevel.description && (
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.9rem',
            marginTop: '-1rem',
            marginBottom: '1.5rem',
          }}
        >
          {currentLevel.description}
        </p>
      )}
      {currentLevel?.id && levelLessons[currentLevel.id] && (
        <div
          style={{
            backgroundColor: 'rgba(108,99,255,0.08)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              color: '#a78bfa',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '0.25rem',
            }}
          >
            {levelLessons[currentLevel.id].concept}
          </div>
          <div
            style={{
              color: '#94a3b8',
              fontSize: '0.85rem',
              fontFamily: 'Fira Code, monospace',
              whiteSpace: 'pre-wrap',
            }}
          >
            {levelLessons[currentLevel.id].example}
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
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
          <HintsPanel hints={currentLevel.hints || []} />
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
