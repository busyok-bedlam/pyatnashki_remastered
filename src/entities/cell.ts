import CanvasContext from './canvas-context';
import { CellMetrics, SwapMetrics } from '../types/cell';
import CellInterface from '../interfaces/cell.interface';
import GameConfig from './game-config';
import GameConfigInstance from '../interfaces/game-config-interface';

export default class Cell implements CellInterface {
  private content: string;

  private id: number;

  public readonly orderNumber: number;

  private positionX: number;

  private positionY: number;

  private ctx: CanvasRenderingContext2D;

  private isHovered = false;

  private padding = 10;

  private gameConfig: GameConfigInstance;

  private isClicked = false;

  constructor(
    id: number,
    positionY: number,
    positionX: number,
    content: string,
    orderNumber: number,
  ) {
    this.id = id;
    this.orderNumber = orderNumber;
    this.content = content;
    this.positionX = positionX;
    this.positionY = positionY;
    const { context } = CanvasContext.getInstance();
    this.ctx = context;
    this.gameConfig = GameConfig.getInstance();
  }

  public draw(): void {
    const {
      cellSize, cellBorderWidth, color, cellFont,
    } = this.gameConfig;
    this.ctx.beginPath();
    this.ctx.fillStyle = color.cellColor;
    this.ctx.rect(this.positionX, this.positionY, cellSize, cellSize);
    this.ctx.fill();
    this.ctx.closePath();
    if (this.isHovered) {
      this.ctx.beginPath();
      this.ctx.rect(
        this.positionX,
        this.positionY,
        cellSize,
        cellSize,
      );
      this.ctx.fillStyle = color.cellHoverColor;
      this.ctx.fill();
      this.ctx.closePath();
    }
    this.ctx.beginPath();
    this.ctx.lineWidth = cellBorderWidth;
    this.ctx.fillStyle = color.cellFontColor;
    this.ctx.strokeStyle = this.isClicked ? color.cellFontColor : color.cellBorderColor;
    this.ctx.strokeRect(
      this.positionX,
      this.positionY,
      cellSize,
      cellSize,
    );
    this.ctx.font = cellFont;
    this.ctx.fillText(
      this.content,
      this.positionX + cellSize / 2,
      this.positionY + cellSize / 2,
    );
    this.ctx.closePath();
  }

  public isEmpty(): boolean {
    return this.content === '';
  }

  public hover(): void {
    this.isHovered = true;
  }

  public unhover(): void {
    this.isHovered = false;
  }

  public click(): void {
    this.isClicked = true;
  }

  public unclick(): void {
    this.isClicked = false;
  }

  public getCellInfo(): CellMetrics {
    return {
      positionX: this.positionX,
      positionY: this.positionY,
      content: this.content,
      id: this.id,
      orderNum: this.orderNumber,
    };
  }

  public updateCellInfo(cellInfo: SwapMetrics): void {
    const {
      id,
      content,
    } = cellInfo;
    this.id = id;
    this.content = content;
  }
}
