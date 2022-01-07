import GameConfigInstance from '../interfaces/game-config-interface';

export default class GameConfig {
  private static instance: GameConfigInstance;

  public static getInstance(): GameConfigInstance {
    if (!GameConfig.instance) {
      const ceilsInRow = 4;
      const canvasSize = 600;
      const gameGap = 30;
      const cellBorderWidth = 4;
      const cellSize = (canvasSize - gameGap * (ceilsInRow + 1)) / ceilsInRow;
      GameConfig.instance = {
        canvasSize,
        cellSize,
        color: {
          cellColor: '#aceccb',
          cellBorderColor: '#7460e1',
          cellClickedBorderColor: '#000',
          cellClickedColor: '#f6930e',
          cellHoveredColor: '#b0c5eb',
          cellComparedHoverColor: '#7eff0a',
          cellUncomparedHoverColor: '#e74121',
          cellFontColor: '#000',
          boardBorderColor: '#000',
          boardBackgroundColor: '#55cce1',
        },
        cellBorderWidth,
        cellFont: 'italic 20pt Arial',
        gameGap,
        canvasBorderWidth: 10,
      };
    }
    return GameConfig.instance;
  }
}
