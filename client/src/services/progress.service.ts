import { get, put } from './api';
import type { UserProgress } from '../types';

interface ProgressResponse {
  progress: UserProgress[];
}

interface SingleProgressResponse {
  progress: UserProgress;
}

interface StatsResponse {
  stats: {
    completedLevels: number;
    totalAttempts: number;
  };
}

interface UpsertProgressData {
  isCompleted?: boolean;
  bestSolution?: string | null;
  attemptsCount?: number;
}

export async function getMyProgress() {
  return get<ProgressResponse>('/progress');
}

export async function upsertProgress(levelId: number, data: UpsertProgressData) {
  return put<SingleProgressResponse>(`/progress/${levelId}`, data);
}

export async function getStats() {
  return get<StatsResponse>('/progress/stats');
}
