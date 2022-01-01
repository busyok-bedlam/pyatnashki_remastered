import Board from './board';
import { GameInterface } from '../interfaces/game.interface';

export default class Game implements GameInterface {
  private border: Board | undefined;

  private static initialize(): void {
    console.log('initializing');
  }

  private static makeStep(): void {
    console.log('Stepping');
  }

  public runGame(): void {
    this.border = new Board();
    console.log('game is starting with new board');
    this.border.draw();
  }
}
