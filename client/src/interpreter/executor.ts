import type { ParsedInstruction, GolemState, GameStep, InterpreterResult, LevelContext } from './types';
import { MAX_STEPS, DIRECTION_VECTORS, TURN_LEFT, TURN_RIGHT } from './constants';

function executeInstructions(
  instructions: ParsedInstruction[],
  initialGolem: GolemState,
  context: LevelContext
): InterpreterResult {
  const result: GameStep[] = [];
  let steps = 0;
  let golem = { ...initialGolem };

  function execute(instructions: ParsedInstruction[]): string | null {
    for (const instruction of instructions) {
      if (steps >= MAX_STEPS) {
        throw new Error('Too many steps (limit: 1000)');
      }

      if (instruction.type === 'command') {
        if (instruction.name === 'move') {
          if (steps >= MAX_STEPS) {
            throw new Error('Too many steps (limit: 1000)');
          }
          const vector = DIRECTION_VECTORS[golem.direction];
          const newX = golem.x + vector.dx;
          const newY = golem.y + vector.dy;

          // Проверка выхода за границы
          if (newX < 0 || newX >= context.gridSize || newY < 0 || newY >= context.gridSize) {
            result.push({
              type: 'error',
              golemState: { ...golem },
              message: 'Голем упёрся в стену',
            });
            return 'Голем упёрся в стену';
          }

          // Проверка препятствий
          const obstacleHit = context.obstacles.some((obs) => obs.x === newX && obs.y === newY);
          if (obstacleHit) {
            result.push({
              type: 'error',
              golemState: { ...golem },
              message: 'Голем упёрся в препятствие',
            });
            return 'Голем упёрся в препятствие';
          }

          golem = { ...golem, x: newX, y: newY };
          result.push({ type: 'move', golemState: { ...golem } });
          steps++;
        } else if (instruction.name === 'turn_left') {
          if (steps >= MAX_STEPS) {
            throw new Error('Too many steps (limit: 1000)');
          }
          golem = { ...golem, direction: TURN_LEFT[golem.direction] };
          result.push({ type: 'turn_left', golemState: { ...golem } });
          steps++;
        } else if (instruction.name === 'turn_right') {
          if (steps >= MAX_STEPS) {
            throw new Error('Too many steps (limit: 1000)');
          }
          golem = { ...golem, direction: TURN_RIGHT[golem.direction] };
          result.push({ type: 'turn_right', golemState: { ...golem } });
          steps++;
        } else if (instruction.name === 'collect') {
          if (steps >= MAX_STEPS) {
            throw new Error('Too many steps (limit: 1000)');
          }
          if (golem.x === context.crystal.x && golem.y === context.crystal.y) {
            result.push({ type: 'collect', golemState: { ...golem }, success: true });
            steps++;
          } else {
            result.push({
              type: 'error',
              golemState: { ...golem },
              message: 'Здесь нечего собирать',
            });
            return 'Здесь нечего собирать';
          }
        }
      } else if (instruction.type === 'repeat') {
        for (let i = 0; i < instruction.count; i++) {
          if (steps >= MAX_STEPS) {
            throw new Error('Too many steps (limit: 1000)');
          }
          const error = execute(instruction.body);
          if (error) {
            return error;
          }
        }
      }
    }
    return null;
  }

  const error = execute(instructions);

  const lastStep = result[result.length - 1];
  const isCompleted =
    !error &&
    golem.x === context.crystal.x &&
    golem.y === context.crystal.y &&
    lastStep?.type === 'collect' &&
    lastStep?.success === true;

  return {
    steps: result,
    error: error,
    isCompleted,
  };
}

export { executeInstructions };
