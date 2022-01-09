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
      const cellFontSize = 15;
      GameConfig.instance = {
        canvasSize,
        cellSize,
        color: {
          cellColor: '#aceccb',
          cellBorderColor: '#7460e1',
          emptyCellBorderColor: '#fdff0c',
          cellClickedBorderColor: '#000',
          cellClickedColor: '#f6930e',
          cellHoveredColor: '#b0c5eb',
          cellComparedHoverColor: '#7bdc10',
          cellUncomparedHoverColor: '#ec5616',
          cellFontColor: '#000',
          boardBorderColor: '#000',
          boardBackgroundColor: '#55cce1',
        },
        cellBorderWidth,
        cellFont: `italic ${cellFontSize}pt Arial`,
        cellFontSize,
        gameGap,
        canvasBorderWidth: 10,
      };
    }
    return GameConfig.instance;
  }
}
