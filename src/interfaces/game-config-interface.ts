export default interface GameConfigInstance {
  canvasSize: number;
  cellSize: number;
  cellBorderWidth: number;
  cellFont: string;
  cellFontSize: number;
  gameGap: number;
  color: Record<string, string>;
  canvasBorderWidth: number;
}
