import { Stage, Layer, Rect, Text } from 'react-konva';
import type { Level, GolemState } from '../../types';

interface GameCanvasProps {
  level: Level;
  golemState: GolemState;
  isAnimating: boolean;
}

const CELL_SIZE = 52;
const GRID_COLOR_1 = '#1e2a4a';
const GRID_COLOR_2 = '#1a2240';
const GRID_STROKE = '#2a3a6a';

export default function GameCanvas({ level, golemState, isAnimating }: GameCanvasProps) {
  // isAnimating будет использован в задаче 6.2 для анимации
  void isAnimating;
  const directionEmoji: Record<string, string> = {
    north: '⬆️',
    south: '⬇️',
    east: '➡️',
    west: '⬅️',
  };

  return (
    <Stage
      width={level.gridSize * CELL_SIZE}
      height={level.gridSize * CELL_SIZE}
      style={{ borderRadius: '12px', overflow: 'hidden' }}
    >
      {/* Layer 1 — сетка */}
      <Layer>
        {Array.from({ length: level.gridSize }).map((_, row) =>
          Array.from({ length: level.gridSize }).map((_, col) => {
            const isEven = (row + col) % 2 === 0;
            return (
              <Rect
                key={`${row}-${col}`}
                x={col * CELL_SIZE}
                y={row * CELL_SIZE}
                width={CELL_SIZE}
                height={CELL_SIZE}
                fill={isEven ? GRID_COLOR_1 : GRID_COLOR_2}
                stroke={GRID_STROKE}
                strokeWidth={1}
              />
            );
          })
        )}
      </Layer>

      {/* Layer 2 — объекты */}
      <Layer>
        {/* Препятствия */}
        {level.initialState.obstacles.map((obs) => (
          <>
            <Rect
              key={`obs-${obs.x}-${obs.y}`}
              x={obs.x * CELL_SIZE + 4}
              y={obs.y * CELL_SIZE + 4}
              width={CELL_SIZE - 8}
              height={CELL_SIZE - 8}
              fill="#3a3a5a"
              cornerRadius={6}
            />
            <Text
              key={`obs-text-${obs.x}-${obs.y}`}
              x={obs.x * CELL_SIZE}
              y={obs.y * CELL_SIZE}
              width={CELL_SIZE}
              height={CELL_SIZE}
              text="🪨"
              fontSize={24}
              align="center"
              verticalAlign="middle"
            />
          </>
        ))}

        {/* Кристалл */}
        <Text
          x={level.initialState.crystal.x * CELL_SIZE}
          y={level.initialState.crystal.y * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          text="💎"
          fontSize={32}
          align="center"
          verticalAlign="middle"
        />

        {/* Голем */}
        <Text
          x={golemState.x * CELL_SIZE}
          y={golemState.y * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          text={directionEmoji[golemState.direction]}
          fontSize={32}
          align="center"
          verticalAlign="middle"
        />
      </Layer>
    </Stage>
  );
}
