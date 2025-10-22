import { Stage, Layer, Rect, Circle } from "react-konva";
import { useEffect, useState, useRef } from "react";

interface Command {
  type: string;
  arg?: string;
}

interface GameCanvasProps {
  commands: Command[];
  initialPosition?: { x: number; y: number };
}

export default function GameCanvas({
  commands,
  initialPosition = { x: 0, y: 0 },
}: GameCanvasProps) {
  const gridSize = 10;
  const cellSize = 50;
  const [position, setPosition] = useState(initialPosition);
  const [effects, setEffects] = useState<
    { id: number; type: string; x: number; y: number }[]
  >([]);

  const positionRef = useRef(position);
  positionRef.current = position;

  const effectId = useRef(0);

  useEffect(() => {
    if (commands.length === 0) return;

    let i = 0;
    const runNext = () => {
      const cmd = commands[i];
      if (!cmd) return;

      if (cmd.type === "move") {
        setPosition((prev) => {
          const next = { ...prev };
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
          return next;
        });
      } else if (cmd.type === "cast") {
        const { x, y } = positionRef.current;
        const id = effectId.current++;
        const newEffect = { id, type: cmd.arg || "spell", x, y };
        setEffects((prev) => [...prev, newEffect]);

        setTimeout(() => {
          setEffects((prev) => prev.filter((e) => e.id !== id));
        }, 800);
      }

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

          {effects.map((eff) => (
            <Circle
              key={eff.id}
              x={eff.x * cellSize + cellSize / 2}
              y={eff.y * cellSize + cellSize / 2}
              radius={20}
              fill={eff.type === "fire" ? "#ff5500" : "#7afcff"}
              opacity={0.7}
            />
          ))}

          <Circle
            x={position.x * cellSize + cellSize / 2}
            y={position.y * cellSize + cellSize / 2}
            radius={cellSize / 3}
            fill="#7afcff"
            shadowColor="#7afcff"
            shadowBlur={20}
            shadowOpacity={0.8}
          />
        </Layer>
      </Stage>
    </div>
  );
}