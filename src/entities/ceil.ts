import CanvasContext from './canvas-context';
import { calculateCanvasCoords } from '../utils';
import { CeilMetrics } from '../types/ceil';

export default class Ceil {
  private content: string;

  private id: number;

  public readonly orderNumber: number;

  private positionX: number;

  private positionY: number;

  private ctx: CanvasRenderingContext2D;

  private height = 50;

  private width = 50;

  private isHovered: boolean;

  private padding = 10;

  constructor(id: number, column: number, row: number, content: string, orderNumber: number) {
    this.id = id;
    this.orderNumber = orderNumber;
    this.content = content;
    this.positionX = calculateCanvasCoords(row);
    this.positionY = calculateCanvasCoords(column);
    const { context } = CanvasContext.getInstance();
    this.ctx = context;
    this.isHovered = false;
  }

  public draw(): void {
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(this.positionX, this.positionY, this.width, this.height);
    this.ctx.font = 'italic 10pt Arial';
    this.ctx.fillText(
      this.content,
      this.positionX + this.width / 2,
      this.positionY + this.height / 2,
    );
    if (this.isHovered) {
      this.ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
    }
    this.ctx.closePath();
  }

  public hover(): void {
    this.isHovered = true;
  }

  public unhover(): void {
    this.isHovered = false;
  }

  public getMetrics(): CeilMetrics {
    return {
      orderNum: this.orderNumber,
      positionX: this.positionX,
      positionY: this.positionY,
      content: this.content,
    };
  }
}
