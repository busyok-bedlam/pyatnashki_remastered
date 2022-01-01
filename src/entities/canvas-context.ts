import { CanvasContextType } from '../types/canvas-contest';

export default class CanvasContext {
  private static instance: CanvasContextType;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance(): CanvasContextType {
    if (!CanvasContext.instance) {
      const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
      canvas.width = 200;
      canvas.height = 200;
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      CanvasContext.instance = {
        context,
        canvas,
      };
    }
    return CanvasContext.instance;
  }
}
