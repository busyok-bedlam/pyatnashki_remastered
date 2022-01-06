export default interface GameConfigInstance {
  canvasSize: number;
  cellSize: number;
  cellBorderWidth: number;
  cellFont: string;
  gameGap: number;
  color: Record<string, string>;
  canvasBorderWidth: number;
}
