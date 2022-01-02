import { CanvasContextType } from '../types/canvas-contest';
import GameConfig from './game-config';

export default class CanvasContext {
  private static instance: CanvasContextType;

  public static getInstance(): CanvasContextType {
    const { canvasSize } = GameConfig.getInstance();
    if (!CanvasContext.instance) {
      const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      CanvasContext.instance = {
        context,
        canvas,
      };
    }
    return CanvasContext.instance;
  }
}
