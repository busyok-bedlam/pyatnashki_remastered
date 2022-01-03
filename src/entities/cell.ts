import CanvasContext from './canvas-context';
import { CellMetrics } from '../types/cell';
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

  private isHovered: boolean;

  private padding = 10;

  private gameConfig: GameConfigInstance;

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
    this.isHovered = false;
    this.gameConfig = GameConfig.getInstance();
  }

  public draw(): void {
    const {
      cellSize, cellBorderWidth, cellColor, cellFont, cellFontColor, cellHoverColor,
    } = this.gameConfig;
    if (this.isHovered) {
      const hoveredRectSize = cellSize - (cellBorderWidth * 2);
      this.ctx.beginPath();
      this.ctx.rect(
        this.positionX + cellBorderWidth,
        this.positionY + cellBorderWidth,
        hoveredRectSize,
        hoveredRectSize,
      );
      this.ctx.fillStyle = cellHoverColor;
      this.ctx.fill();
      this.ctx.closePath();
    }
    this.ctx.beginPath();
    this.ctx.lineWidth = cellBorderWidth;
    this.ctx.fillStyle = cellFontColor;
    this.ctx.strokeStyle = cellColor;
    this.ctx.strokeRect(this.positionX, this.positionY, cellSize, cellSize);
    this.ctx.font = cellFont;
    this.ctx.fillText(
      this.content,
      this.positionX + cellSize / 2,
      this.positionY + cellSize / 2,
    );
    this.ctx.closePath();
  }

  public hover(): void {
    this.isHovered = true;
  }

  public unhover(): void {
    this.isHovered = false;
  }

  public getCellInfo(): CellMetrics {
    return {
      positionX: this.positionX,
      positionY: this.positionY,
      content: this.content,
      id: this.id,
    };
  }

  public updateCellInfo(cellInfo: CellMetrics): void {
    const {
      id,
      positionX,
      positionY,
      content,
    } = cellInfo;
    this.id = id;
    this.positionX = positionX;
    this.positionY = positionY;
    this.content = content;
  }
}
