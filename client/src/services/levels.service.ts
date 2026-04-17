import { get } from './api';
import type { Level } from '../types';

interface LevelsResponse {
  levels: Level[];
}

interface LevelResponse {
  level: Level;
}

export async function getLevels() {
  return get<LevelsResponse>('/levels');
}

export async function getLevelById(id: number) {
  return get<LevelResponse>(`/levels/${id}`);
}
