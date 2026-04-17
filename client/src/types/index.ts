export interface User {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
}

export interface Level {
  id: number;
  title: string;
  description?: string;
  gridSize: number;
  initialState: LevelInitialState;
  goalState: LevelGoalState;
  difficulty?: 'easy' | 'medium' | 'hard';
  orderIndex: number;
  createdAt: Date;
}

export interface LevelInitialState {
  golem: GolemState;
  crystal: Crystal;
  obstacles: Obstacle[];
}

export interface LevelGoalState {
  type: 'reach';
  target: 'crystal';
}

export interface UserProgress {
  id: number;
  userId: number;
  levelId: number;
  isCompleted: boolean;
  bestSolution: string | null;
  attemptsCount: number;
  completedAt: Date | null;
  level?: Level;
}

export interface GolemState {
  x: number;
  y: number;
  direction: 'north' | 'south' | 'east' | 'west';
}

export interface Obstacle {
  x: number;
  y: number;
}

export interface Crystal {
  x: number;
  y: number;
}

export interface LevelGoal {
  type: 'reach';
  target: 'crystal';
}

export interface GameStep {
  type: 'move' | 'turn_left' | 'turn_right' | 'collect' | 'error';
  golemState: GolemState;
  message?: string;
  success?: boolean;
}
