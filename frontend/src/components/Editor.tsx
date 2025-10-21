import { useState } from "react";
import Editor from "@monaco-editor/react";
import { parseCode } from "../core/interpreter";

interface EditorProps {
  onRun: (commands: { type: string; arg?: string }[]) => void;
}

export default function SpellEditor({ onRun }: EditorProps) {
  const [code, setCode] = useState(`move("forward")
cast("fire")
repeat(3):
    move("right")`);

  return (
    <div className="w-full h-[80vh] bg-[#120024] rounded-2xl shadow-glow p-2 flex flex-col">
      <Editor
        height="100%"
        defaultLanguage="python"
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
      <button
        onClick={() => onRun(parseCode(code))}
        className="mt-2 bg-magicViolet px-4 py-2 rounded-xl hover:shadow-glow transition"
      >
        🔮 Произнести заклинание
      </button>
    </div>
  );
}
