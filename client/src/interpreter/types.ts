export type Direction = 'north' | 'south' | 'east' | 'west';

export interface GolemState {
  x: number;
  y: number;
  direction: Direction;
}

export interface GameStep {
  type: 'move' | 'turn_left' | 'turn_right' | 'collect' | 'error';
  golemState: GolemState;
  message?: string;
  success?: boolean;
}

export interface InterpreterResult {
  steps: GameStep[];
  error: string | null;
  isCompleted: boolean;
}

export interface LevelContext {
  gridSize: number;
  crystal: { x: number; y: number };
  obstacles: Array<{ x: number; y: number }>;
  goal: { type: 'reach'; target: 'crystal' };
}

export type ParsedInstruction =
  | { type: 'command'; name: string }
  | { type: 'repeat'; count: number; body: ParsedInstruction[] };

export class ParseError extends Error {
  line: number;

  constructor(message: string, line: number) {
    super(message);
    this.name = 'ParseError';
    this.line = line;
  }
}
