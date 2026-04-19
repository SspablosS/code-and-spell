import { test, expect } from 'vitest';
import { runCode } from '../index';

const defaultContext = {
  gridSize: 10,
  crystal: { x: 3, y: 0 },
  obstacles: [],
  goal: { type: 'reach' as const, target: 'crystal' as const },
};

const defaultGolem = { x: 0, y: 0, direction: 'east' as const };

test('move() три раза достигает кристалла', () => {
  const result = runCode('move()\nmove()\nmove()', defaultGolem, defaultContext);
  expect(result.isCompleted).toBe(true);
  expect(result.steps.length).toBe(3);
  expect(result.error).toBeNull();
});

test('turn_right меняет направление с east на south', () => {
  const result = runCode('turn_right()', defaultGolem, defaultContext);
  expect(result.steps[0].golemState.direction).toBe('south');
});

test('repeat 3: move() выполняет 3 шага', () => {
  const result = runCode('repeat 3:\n    move()', defaultGolem, defaultContext);
  expect(result.steps.length).toBe(3);
});

test('step limit: repeat 1001 раз бросает ошибку', () => {
  const result = runCode('repeat 1001:\n    turn_right()', defaultGolem, defaultContext);
  expect(result.error).toContain('Too many steps');
});

test('move() за границу даёт ошибку', () => {
  const wallGolem = { x: 9, y: 0, direction: 'east' as const };
  const result = runCode('move()', wallGolem, defaultContext);
  expect(result.error).not.toBeNull();
});

test('неизвестная команда возвращает ошибку', () => {
  const result = runCode('fly()', defaultGolem, defaultContext);
  expect(result.error).not.toBeNull();
});

test('пустой код — нет шагов и нет ошибки', () => {
  const result = runCode('', defaultGolem, defaultContext);
  expect(result.steps.length).toBe(0);
  expect(result.error).toBeNull();
});
