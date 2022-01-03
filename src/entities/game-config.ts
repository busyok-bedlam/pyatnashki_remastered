import GameConfigInstance from '../interfaces/game-config-interface';

export default class GameConfig {
  private static instance: GameConfigInstance;

  public static getInstance(): GameConfigInstance {
    if (!GameConfig.instance) {
      const canvasSize = 500;
      GameConfig.instance = {
        canvasSize,
        cellSize: canvasSize / 4,
        canvasBorderColor: '#000',
        cellColor: 'green',
        cellBorderWidth: 2,
        cellFont: 'italic 10pt Arial',
        cellHoverColor: '#c5e889',
        cellFontColor: '#000',
      };
    }
    return GameConfig.instance;
  }
}
