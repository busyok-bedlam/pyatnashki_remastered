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
    this.clearCell();
    this.drawBackground();
    this.drawBorder();
    this.drawText();
  }

  private clearCell = (): void => {
    const {
      cellSize, color,
    } = this.gameConfig;
    this.ctx.beginPath();
    this.ctx.fillStyle = color.cellColor;
    this.ctx.rect(this.positionX, this.positionY, cellSize, cellSize);
    this.ctx.fill();
    this.ctx.closePath();
  };

  private drawBackground = (): void => {
    const {
      cellSize, color,
    } = this.gameConfig;
    this.ctx.beginPath();
    switch (this.cellStatus) {
      case CellStatuses.clicked: {
        this.ctx.fillStyle = color.cellClickedColor;
        break;
      }
      case CellStatuses.hovered: {
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
            this.ctx.fillStyle = color.cellHoveredColor;
          }
        }
        this.ctx.fill();
        this.ctx.closePath();
        break;
      }
      default: {
        this.ctx.strokeStyle = color.cellColor;
      }
    }
    this.ctx.rect(this.positionX, this.positionY, cellSize, cellSize);
    this.ctx.fill();
  };

  private drawText = (): void => {
    const {
      cellSize, cellFont,
    } = this.gameConfig;
    this.ctx.beginPath();
    this.ctx.font = cellFont;

    this.ctx.fillStyle = '#000';
    this.ctx.fillText(
      this.content,
      this.positionX + cellSize / 2,
      this.positionY + cellSize / 2,
    );
    this.ctx.closePath();
  };

  private drawBorder = (): void => {
    const {
      cellSize, cellBorderWidth, color,
    } = this.gameConfig;
    this.ctx.beginPath();
    this.ctx.lineWidth = cellBorderWidth;
    this.ctx.fillStyle = color.cellFontColor;
    switch (this.cellStatus) {
      case CellStatuses.clicked: {
        this.ctx.strokeStyle = color.cellClickedBorderColor;
        break;
      }
      default: {
        this.ctx.strokeStyle = color.cellBorderColor;
        break;
      }
    }
    this.ctx.strokeRect(
      this.positionX,
      this.positionY,
      cellSize,
      cellSize,
    );
    this.ctx.closePath();
  };

  public isHovered = (): boolean => this.cellStatus === CellStatuses.hovered;

  public isEmpty = (): boolean => this.content === '';

  public isClicked = (): boolean => this.cellStatus === CellStatuses.clicked;

  public hover = (hoveringType: HoveringType): void => {
    this.hovered = true;
    this.hoveringType = hoveringType;
    this.cellStatus = CellStatuses.hovered;
  };

  public unhover = (): void => {
    this.hovered = false;
    if (this.cellStatus === CellStatuses.hovered) {
      this.cellStatus = CellStatuses.default;
    }
  };

  public click = (): void => {
    this.clicked = true;
    this.cellStatus = CellStatuses.clicked;
  };

  public unclick(): void {
    this.clicked = false;
    if (this.cellStatus === CellStatuses.clicked) {
      this.cellStatus = CellStatuses.default;
    }
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
