import {
  range, shuffle, isEqual,
} from 'lodash';
import Cell from './cell';
import { BoardInterface } from '../interfaces/board.interface';
import { findRow, findCol } from '../utils';
import { Coords, CellMetrics, HoveringTypes } from '../types/cell';
import CanvasContext from './canvas-context';
import GameConfig from './game-config';
import GameConfigInstance from '../interfaces/game-config-interface';

export default class Board implements BoardInterface {
  private field: Cell[];

  private readonly gameConfig: GameConfigInstance;

  private canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D;

  private cellsToSwap: Cell[] = [];

  private hoveredCellToCompare: Cell | null = null;

  constructor() {
    this.field = Board.generateField();
    this.canvas = CanvasContext.getInstance().canvas;
    this.ctx = CanvasContext.getInstance().context;
    this.subscribeToEvents();
    this.gameConfig = GameConfig.getInstance();
  }

  private static generateField(): Cell[] {
    let randomizedArray: Array<string | number> = range(1, 16);
    randomizedArray.push('');
    randomizedArray = shuffle(randomizedArray);
    return randomizedArray.map(
      (item, index) => {
        const { positionX, positionY } = Board.calculateCellCoordsOnCanvas(index);
        return new Cell(
          index + 1,
          positionX,
          positionY,
          `${item}`,
          index + 1,
        );
      },
    );
  }

  private calculate(event: MouseEvent): void {
    if (this.isVictory()) {
      this.unsubscribeFromEvents();
    } else if (event.type === 'mousemove') {
      this.field.forEach((ceilItem) => {
        ceilItem.unhover();
      });
      const hoveredCellCoords = this.getCoordinatesOnBoard(event);
      const hoveredCell = this.findCeilByCoords(hoveredCellCoords);
      if (this.hasClickedCell()) {
        const [clickedCell] = this.cellsToSwap;
        if (this.hoveredCellToCompare !== hoveredCell) {
          this.hoveredCellToCompare = hoveredCell;
        }
        if (this.hoveredCellToCompare !== clickedCell) {
          if (
            Board.isCellNeighbour(clickedCell, this.hoveredCellToCompare)
            && [this.hoveredCellToCompare, clickedCell].some((cellItem) => cellItem.isEmpty())
          ) {
            this.hoveredCellToCompare.hover(HoveringTypes.compared);
          } else {
            this.hoveredCellToCompare.hover(HoveringTypes.uncompared);
          }
        }
        return;
      }
      if (!hoveredCell?.isClicked()) {
        hoveredCell?.hover(HoveringTypes.default);
      }
    } else if (event.type === 'mouseout') {
      this.field.forEach((cellItem) => {
        cellItem?.unhover();
        this.cellsToSwap = [];
      });
      this.field.forEach((cellItem) => {
        cellItem?.unclick();
      });
    } else if (event.type === 'click') {
      this.field.forEach((cellItem) => {
        cellItem?.unclick();
      });
      this.hoveredCellToCompare = null;
      if (this.cellsToSwap.length > 0) {
        this.field.forEach((cellItem) => {
          cellItem?.unhover();
        });
      }
      const clickedCellCoords = this.getCoordinatesOnBoard(event);
      const clickedCell = this.findCeilByCoords(clickedCellCoords);
      if (clickedCell) {
        this.cellsToSwap.push(clickedCell);
        if (this.cellsToSwap.length < 2) {
          clickedCell.click();
        } else if (
          this.cellsToSwap.length === 2
            && this.cellsToSwap.some((cellItem) => cellItem.isEmpty())
            && Board.isCellNeighbour(this.cellsToSwap[0], this.cellsToSwap[1])
        ) {
          this.swapElements();
          this.cellsToSwap = [];
        } else {
          this.cellsToSwap = [];
        }
      }
    }
  }

  public isVictory(): boolean {
    const victoryBoard = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, ''];
    const currentBoard: Array<string | number> = this.field.map((cellItem) => {
      const { content } = cellItem.getCellInfo();
      // eslint-disable-next-line no-extra-boolean-cast
      const result: string | number = !!Number.parseInt(content, 10)
        ? Number.parseInt(content, 10) : content;
      return result;
    });
    const res = isEqual(victoryBoard, currentBoard);
    return res;
  }

  private hasClickedCell = (): boolean => this.field.some((cellItem) => cellItem.isClicked());

  public draw(): void {
    const { canvasSize, color, canvasBorderWidth } = this.gameConfig;

    this.ctx.beginPath();
    this.ctx.fillStyle = color.boardBackgroundColor;
    this.ctx.rect(0, 0, canvasSize, canvasSize);
    this.ctx.fill();
    this.ctx.closePath();
    if (this.isVictory()) {
      this.ctx.beginPath();
      this.ctx.fillStyle = '#000';
      this.ctx.fillText('YOU WIN', 50, 50);
      this.ctx.closePath();
    } else {
      this.field.forEach((ceilItem) => {
        ceilItem.draw();
      });
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = color.boardBorderColor;
    this.ctx.lineWidth = canvasBorderWidth;
    this.ctx.strokeRect(
      0 + canvasBorderWidth / 2,
      0 + canvasBorderWidth / 2,
      canvasSize - canvasBorderWidth,
      canvasSize - canvasBorderWidth,
    );
    this.ctx.closePath();
  }

  private findCeilByCoords = (coords: Coords): Cell => {
    const { cellSize } = this.gameConfig;
    const ceilByCoords = this.field.find((ceilItem: Cell) => {
      const { positionX, positionY } = ceilItem.getCellInfo() as CellMetrics;
      return coords.x >= positionX
        && coords.x <= positionX + cellSize
        && coords.y >= positionY
        && coords.y <= positionY + cellSize;
    }) as Cell;
    return ceilByCoords;
  };

  private handleOnHover = (event: MouseEvent): void => {
    event.preventDefault();
    const { canvasSize } = this.gameConfig;
    this.calculate(event);
    this.ctx.clearRect(0, 0, canvasSize, canvasSize);
    this.draw();
  };

  private handleOnMouseOut = (event: MouseEvent): void => {
    event.preventDefault();
    const { canvasSize } = this.gameConfig;
    this.calculate(event);
    this.ctx.clearRect(0, 0, canvasSize, canvasSize);
    this.draw();
  };

  private handleOnMouseClick = (event: MouseEvent) => {
    event.preventDefault();
    const { canvasSize } = this.gameConfig;
    this.calculate(event);
    this.ctx.clearRect(0, 0, canvasSize, canvasSize);
    this.draw();
  };

  private getCoordinatesOnBoard = (event: MouseEvent): Coords => {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  private subscribeToEvents = (): void => {
    this.canvas.addEventListener('mousemove', this.handleOnHover);
    this.canvas.addEventListener('mouseout', this.handleOnMouseOut);
    this.canvas.addEventListener('click', this.handleOnMouseClick);
  };

  private unsubscribeFromEvents = (): void => {
    this.canvas.removeEventListener('mousemove', this.handleOnHover, true);
    this.canvas.removeEventListener('click', this.handleOnMouseClick, true);
    this.canvas.removeEventListener('mouseout', this.handleOnMouseOut, true);
  };

  private static calculateCellCoordsOnCanvas = (elemIndex: number): Record<'positionX' | 'positionY', number> => {
    const { cellSize, gameGap } = GameConfig.getInstance();
    const orderOnBoard = elemIndex + 1;
    const orderByX = findCol(orderOnBoard);
    const orderByY = findRow(orderOnBoard);
    const positionX = (cellSize * (orderByX - 1)) + gameGap * orderByX;
    const positionY = (cellSize * (orderByY - 1)) + gameGap * orderByY;
    return { positionX, positionY };
  };

  private swapElements(): void {
    const [
      firstCellInfo,
      secondCellInfo,
    ] = this.cellsToSwap.map((cellItem) => {
      const { id, content } = cellItem.getCellInfo();
      return {
        id,
        content,
      };
    });
    this.cellsToSwap[0].updateCellInfo(secondCellInfo);
    this.cellsToSwap[1].updateCellInfo(firstCellInfo);
  }

  private static isCellNeighbour = (firstCell: Cell, secondCell: Cell): boolean => {
    const [firstCellOrderNum, secondCellOrderNum] = [firstCell, secondCell].map((cellItem) => {
      const { orderNum } = cellItem.getCellInfo();
      return orderNum;
    });
    const isOnOneRow = findRow(firstCellOrderNum) === findRow(secondCellOrderNum);
    const isOnOneColumn = findCol(firstCellOrderNum) === findCol(secondCellOrderNum);
    if (isOnOneRow) {
      const diffBetweenRowIndexes = Math.abs(
        findCol(firstCellOrderNum) - findCol(secondCellOrderNum),
      );
      return diffBetweenRowIndexes === 1;
    } if (isOnOneColumn) {
      const diffBetweenColumnIndexes = Math.abs(
        findRow(firstCellOrderNum) - findRow(secondCellOrderNum),
      );
      return diffBetweenColumnIndexes === 1;
    }
    return false;
  };
}
