import { create } from 'zustand';
import type { GameStep, GolemState, Level } from '../types';

interface GameState {
  currentLevel: Level | null;
  golemState: GolemState;
  code: string;
  isRunning: boolean;
  isCompleted: boolean;
  isFailed: boolean;
  errorMessage: string | null;
  steps: GameStep[];
  currentStepIndex: number;
  setLevel: (level: Level | null) => void;
  setCode: (code: string) => void;
  setRunning: (isRunning: boolean) => void;
  setSteps: (steps: GameStep[]) => void;
  setCompleted: (isCompleted: boolean) => void;
  setGolemState: (golemState: GolemState) => void;
  applyStep: (step: GameStep) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentLevel: null,
  golemState: { x: 0, y: 0, direction: 'north' },
  code: '',
  isRunning: false,
  isCompleted: false,
  isFailed: false,
  errorMessage: null,
  steps: [],
  currentStepIndex: 0,
  setLevel: (level) => set({ currentLevel: level }),
  setCode: (code) => set({ code }),
  setRunning: (isRunning) => set({ isRunning }),
  setSteps: (steps) => set({ steps, currentStepIndex: 0 }),
  setCompleted: (isCompleted) => set({ isCompleted }),
  setGolemState: (golemState) => set({ golemState }),
  applyStep: (step) =>
    set((state) => ({
      golemState: step.golemState,
      currentStepIndex: state.currentStepIndex + 1,
    })),
  reset: () =>
    set({
      golemState: { x: 0, y: 0, direction: 'north' },
      code: '',
      isRunning: false,
      isCompleted: false,
      isFailed: false,
      errorMessage: null,
      steps: [],
      currentStepIndex: 0,
    }),
}));
