export type Command = { type: string; arg?: string };

export function parseCode(code: string): Command[] {
  const lines = code.split("\n").map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    const indent = line.length - line.trimStart().length;
    return { index, raw: line, trimmed, indent };
  }).filter(Boolean) as { index: number; raw: string; trimmed: string; indent: number }[];

  const commands: Command[] = [];
  let i = 0;

  while (i < lines.length) {
    const current = lines[i];

    if (/^repeat\(\d+\):?$/.test(current.trimmed)) {
      const timesMatch = current.trimmed.match(/repeat\((\d+)\):?/);
      const times = timesMatch ? parseInt(timesMatch[1], 10) : 1;

      const next = lines[i + 1];
      let bodyCommand: Command | null = null;

      if (next && next.indent > current.indent) {
        if (next.trimmed.startsWith("move(")) {
          const arg = next.trimmed.match(/"([^"]+)"/)?.[1];
          bodyCommand = { type: "move", arg };
        } else if (next.trimmed.startsWith("cast(")) {
          const arg = next.trimmed.match(/"([^"]+)"/)?.[1];
          bodyCommand = { type: "cast", arg };
        }
      }

      if (bodyCommand) {
        for (let t = 0; t < times; t++) {
          commands.push({ ...bodyCommand });
        }
      }

      i += 2;
    }
    else if (current.trimmed.startsWith("move(")) {
      const arg = current.trimmed.match(/"([^"]+)"/)?.[1];
      commands.push({ type: "move", arg });
      i++;
    } else if (current.trimmed.startsWith("cast(")) {
      const arg = current.trimmed.match(/"([^"]+)"/)?.[1];
      commands.push({ type: "cast", arg });
      i++;
    } else {
      i++;
    }
  }

  return commands;
}