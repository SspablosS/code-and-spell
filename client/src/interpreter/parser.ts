import type { ParsedInstruction } from './types';
import { ParseError } from './types';

export function parseCode(code: string): ParsedInstruction[] {
  const instructions: ParsedInstruction[] = [];
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Пропускаем пустые строки и комментарии
    if (!line || line.startsWith('#')) {
      continue;
    }

    if (line === 'move()') {
      instructions.push({ type: 'command', name: 'move' });
    } else if (line === 'turn_left()') {
      instructions.push({ type: 'command', name: 'turn_left' });
    } else if (line === 'turn_right()') {
      instructions.push({ type: 'command', name: 'turn_right' });
    } else if (line === 'collect()') {
      instructions.push({ type: 'command', name: 'collect' });
    } else {
      const repeatMatch = line.match(/^repeat (\d+):$/);
      if (repeatMatch) {
        const count = parseInt(repeatMatch[1], 10);
        const body: ParsedInstruction[] = [];

        // Сбор body: следующие строки пока они начинаются с 4 пробелов или таба
        let j = i + 1;
        while (j < lines.length) {
          const originalLine = lines[j];
          if (originalLine.startsWith('    ') || originalLine.startsWith('\t')) {
            const bodyLine = originalLine.trim();

            if (bodyLine === 'move()') {
              body.push({ type: 'command', name: 'move' });
            } else if (bodyLine === 'turn_left()') {
              body.push({ type: 'command', name: 'turn_left' });
            } else if (bodyLine === 'turn_right()') {
              body.push({ type: 'command', name: 'turn_right' });
            } else if (bodyLine === 'collect()') {
              body.push({ type: 'command', name: 'collect' });
            } else if (bodyLine.startsWith('repeat')) {
              throw new ParseError('Вложенные циклы не поддерживаются', i + 1);
            } else {
              throw new ParseError(`Неизвестная команда: ${bodyLine}`, j + 1);
            }

            j++;
          } else {
            break;
          }
        }

        instructions.push({ type: 'repeat', count, body });
        i = j - 1; // Сдвинуть i за пределы body
      } else {
        throw new ParseError(`Неизвестная команда: ${line}`, i + 1);
      }
    }
  }

  return instructions;
}
