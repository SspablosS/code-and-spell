import { useState, useEffect, useCallback } from 'react';
import type { GameStep } from '../types';
import { STEP_DELAY_MS } from '../interpreter/constants';

interface UseGolemAnimationProps {
  steps: GameStep[];
  isCompleted: boolean;
  onStepApplied: (step: GameStep, index: number) => void;
  onAnimationComplete: (isCompleted: boolean) => void;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useGolemAnimation({
  steps,
  isCompleted,
  onStepApplied,
  onAnimationComplete,
}: UseGolemAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const runAnimation = useCallback(async () => {
    if (steps.length === 0) {
      onAnimationComplete(isCompleted);
      return;
    }

    setIsAnimating(true);

    for (let i = 0; i < steps.length; i++) {
      onStepApplied(steps[i], i);
      await delay(STEP_DELAY_MS);
    }

    const lastStep = steps[steps.length - 1];
    onAnimationComplete(lastStep?.success || isCompleted);
    setIsAnimating(false);
  }, [steps, isCompleted, onStepApplied, onAnimationComplete]);

  useEffect(() => {
    if (steps.length > 0) {
      const timeout = setTimeout(() => {
        runAnimation();
      }, 0);
      return () => clearTimeout(timeout);
    }
  }, [steps, runAnimation]);

  return { isAnimating };
}
