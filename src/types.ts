export interface BlockState {
  revealed: boolean;
  mine: boolean;
  flagged: boolean;
  adjacentMines: number;
  y: number;
  x: number;
}
