import { useState } from "react";
import SpellEditor from "./components/Editor";
import GameCanvas from "./components/GameCanvas";

export default function App() {
  const [commands, setCommands] = useState<{ type: string; arg?: string }[]>([]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row gap-4 p-4 bg-darkBg">
      <div className="md:w-1/2">
        <h1 className="text-3xl font-bold mb-4 text-magicBlue drop-shadow-glow">
          🪄 Code & Spell
        </h1>
        <SpellEditor onRun={setCommands} />
      </div>
      <div className="md:w-1/2 flex justify-center items-center">
        <GameCanvas commands={commands} />
      </div>
    </div>
  );
}
