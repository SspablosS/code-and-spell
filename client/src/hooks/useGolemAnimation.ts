import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameStep } from '../types';
import { STEP_DELAY_MS } from '../interpreter/constants';

interface UseGolemAnimationProps {
  steps: GameStep[];
  isCompleted: boolean;
  onStepApplied: (step: GameStep, index: number) => void;
  onAnimationComplete: (isCompleted: boolean, steps: GameStep[]) => void;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useGolemAnimation({
  steps,
  isCompleted,
  onStepApplied,
  onAnimationComplete,
}: UseGolemAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const isRunningRef = useRef(false);

  const runAnimation = useCallback(async () => {
    if (isRunningRef.current) return;
    if (!steps || steps.length === 0) {
      onAnimationComplete(isCompleted, steps);
      return;
    }

    isRunningRef.current = true;
    setIsAnimating(true);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      onStepApplied(step, i);
      await delay(STEP_DELAY_MS);
    }

    const lastStep = steps[steps.length - 1];
    onAnimationComplete(lastStep?.success || isCompleted, steps);
    setIsAnimating(false);
    isRunningRef.current = false;
  }, [steps, isCompleted, onStepApplied, onAnimationComplete]);

  useEffect(() => {
    if (!steps || steps.length === 0) return;
    const timeout = setTimeout(() => {
      runAnimation();
    }, 0);
    return () => {
      clearTimeout(timeout);
      isRunningRef.current = false;
    };
  }, [steps, runAnimation]);

  return { isAnimating };
}
