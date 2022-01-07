import CanvasContext from './canvas-context';
import {
  CellMetrics, CellStatus, CellStatuses, HoveringType, HoveringTypes, SwapMetrics,
} from '../types/cell';
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

  private cellStatus: CellStatus = CellStatuses.default;

  private hovered = false;

  private padding = 10;

  private gameConfig: GameConfigInstance;

  private clicked = false;

  private hoveringType: HoveringType = 'default';

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
    if (this.isHovered()) {
      this.ctx.beginPath();
      this.ctx.rect(
        this.positionX,
        this.positionY,
        cellSize,
        cellSize,
      );
      switch (this.hoveringType) {
        case HoveringTypes.uncompared: {
          this.ctx.fillStyle = color.cellUncomparedHoverColor;
          break;
        }
        case HoveringTypes.compared: {
          this.ctx.fillStyle = color.cellComparedHoverColor;
          break;
        }
        default: {
          this.ctx.fillStyle = color.cellDefaultColor;
        }
      }
      this.ctx.fill();
      this.ctx.closePath();
    }
    this.ctx.beginPath();
    this.ctx.lineWidth = cellBorderWidth;
    this.ctx.fillStyle = color.cellFontColor;
    this.ctx.strokeStyle = this.isClicked() ? color.cellFontColor : color.cellBorderColor;
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

  public isHovered = (): boolean => this.hovered;

  public isEmpty = (): boolean => this.content === '';

  public isClicked = (): boolean => this.clicked;

  public hover = (hoveringType: HoveringType): void => {
    this.hovered = true;
    this.hoveringType = hoveringType;
  };

  public unhover = (): void => {
    this.hovered = false;
  };

  public click = (): void => {
    this.clicked = true;
  };

  public unclick(): void {
    this.clicked = false;
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
