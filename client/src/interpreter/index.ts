import { parseCode } from './parser';
import { executeInstructions } from './executor';
import type { GolemState, InterpreterResult, LevelContext, Direction, GameStep, ParsedInstruction } from './types';
import { ParseError } from './types';

export function runCode(code: string, initialGolem: GolemState, context: LevelContext): InterpreterResult {
  try {
    const instructions = parseCode(code);
    return executeInstructions(instructions, initialGolem, context);
  } catch (e) {
    return { steps: [], error: (e as Error).message, isCompleted: false };
  }
}

export type { Direction, GolemState, GameStep, InterpreterResult, LevelContext, ParsedInstruction };
export { ParseError };
