import { Stage, Layer, Rect, Circle } from "react-konva";
import { useEffect, useState } from "react";
import gsap from "gsap";

interface GameCanvasProps {
  commands: { type: string; arg?: string }[];
}

export default function GameCanvas({ commands }: GameCanvasProps) {
  const gridSize = 10;
  const cellSize = 50;
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Выполнение команд
  useEffect(() => {
    if (commands.length === 0) return;

    let i = 0;
    const runNext = () => {
      const cmd = commands[i];
      if (!cmd) return;

      setPosition((prev) => {
        const next = { ...prev };
        if (cmd.type === "move") {
          switch (cmd.arg) {
            case "right":
              next.x = Math.min(prev.x + 1, gridSize - 1);
              break;
            case "left":
              next.x = Math.max(prev.x - 1, 0);
              break;
            case "down":
            case "forward":
              next.y = Math.min(prev.y + 1, gridSize - 1);
              break;
            case "up":
              next.y = Math.max(prev.y - 1, 0);
              break;
          }
        }
        return next;
      });

      i++;
      if (i < commands.length) {
        setTimeout(runNext, 600);
      }
    };

    runNext();
  }, [commands]);

  const stageSize = gridSize * cellSize;

  return (
    <div className="bg-[#0f0020] rounded-2xl shadow-glow p-2">
      <Stage width={stageSize} height={stageSize}>
        <Layer>
          {[...Array(gridSize * gridSize)].map((_, i) => {
            const x = (i % gridSize) * cellSize;
            const y = Math.floor(i / gridSize) * cellSize;
            return (
              <Rect
                key={i}
                x={x}
                y={y}
                width={cellSize}
                height={cellSize}
                stroke="#2a0047"
              />
            );
          })}
          <Circle
            x={position.x * cellSize + cellSize / 2}
            y={position.y * cellSize + cellSize / 2}
            radius={cellSize / 3}
            fill="#7afcff"
            shadowColor="#7afcff"
            shadowBlur={20}
          />
        </Layer>
      </Stage>
    </div>
  );
}
