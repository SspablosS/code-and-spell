type Command = { type: string; arg?: string };

export function parseCode(code: string): Command[] {
  const lines = code.split("\n").map((l) => l.trim()).filter(Boolean);
  const commands: Command[] = [];

  for (const line of lines) {
    if (line.startsWith("move(")) {
      const arg = line.match(/"(.+?)"/)?.[1];
      commands.push({ type: "move", arg });
    } else if (line.startsWith("cast(")) {
      const arg = line.match(/"(.+?)"/)?.[1];
      commands.push({ type: "cast", arg });
    } else if (line.startsWith("repeat(")) {
      // Простая обработка repeat(n):
      const times = Number(line.match(/\((\d+)\)/)?.[1] || 1);
      const nextLine = lines[lines.indexOf(line) + 1];
      const innerCmd = nextLine?.match(/"(.+?)"/)?.[1];
      for (let i = 0; i < times; i++) {
        commands.push({ type: "move", arg: innerCmd || "forward" });
      }
    }
  }

  return commands;
}
