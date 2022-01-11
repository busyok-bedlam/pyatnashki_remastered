/* eslint-disable no-debugger */
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
import { GameEvents, KeyboardMoveCodes } from '../types/event-types';
import SoundManager from './sound-manager';

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

  private calculate(event: MouseEvent | KeyboardEvent): void {
    if (this.isVictory()) {
      this.unsubscribeFromEvents();
    } else {
      switch (event.type) {
        case GameEvents.click: {
          this.field.forEach((cellItem) => {
            cellItem?.unclick();
          });
          this.hoveredCellToCompare = null;
          if (this.cellsToSwap.length > 0) {
            this.field.forEach((cellItem) => {
              cellItem?.unhover();
            });
          }
          const clickedCellCoords = this.getCoordinatesOnBoard(event as MouseEvent);
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
          break;
        }
        case GameEvents.mousemove: {
          this.field.forEach((ceilItem) => {
            ceilItem.unhover();
          });
          const hoveredCellCoords = this.getCoordinatesOnBoard(event as MouseEvent);
          const hoveredCell = this.findCeilByCoords(hoveredCellCoords);
          if (this.hasClickedCell() && hoveredCell) {
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
          break;
        }
        case GameEvents.mouseout: {
          this.field.forEach((cellItem) => {
            cellItem?.unhover();
            this.cellsToSwap = [];
          });
          this.field.forEach((cellItem) => {
            cellItem?.unclick();
          });
          break;
        }
        case GameEvents.keydown: {
          this.cellsToSwap = [];
          this.field.forEach((cellItem) => cellItem.unclick());
          this.field.forEach((cellItem) => cellItem.unhover());
          const emptyCell = this.field.find((cellItem) => cellItem.isEmpty()) as Cell;
          const emptyCellOrderNum = emptyCell.getOrderNum();
          let cellToSwap: Cell;
          const { code: keyCode } = event as KeyboardEvent;
          switch (keyCode) {
            case KeyboardMoveCodes.right: {
              if (findRow(emptyCellOrderNum) < 4) {
                const cellToSwapOrderNum = emptyCellOrderNum + 4;
                cellToSwap = this.field.find(
                  (cellItem) => cellItem.getOrderNum() === cellToSwapOrderNum,
                ) as Cell;
                this.cellsToSwap.push(emptyCell, cellToSwap);
                this.swapElements();
              }
              break;
            }
            case KeyboardMoveCodes.left: {
              if (findRow(emptyCellOrderNum) > 1) {
                const cellToSwapOrderNum = emptyCellOrderNum - 4;
                cellToSwap = this.field.find(
                  (cellItem) => cellItem.getOrderNum() === cellToSwapOrderNum,
                ) as Cell;
                this.cellsToSwap.push(emptyCell, cellToSwap);
                this.swapElements();
              }
              break;
            }
            case KeyboardMoveCodes.up: {
              if (findCol(emptyCellOrderNum) > 1) {
                const cellToSwapOrderNum = emptyCellOrderNum - 1;
                cellToSwap = this.field.find(
                  (cellItem) => cellItem.getOrderNum() === cellToSwapOrderNum,
                ) as Cell;
                this.cellsToSwap.push(emptyCell, cellToSwap);
                this.swapElements();
              }
              break;
            }
            case KeyboardMoveCodes.down: {
              if (findCol(emptyCellOrderNum) < 4) {
                const cellToSwapOrderNum = emptyCellOrderNum + 1;
                cellToSwap = this.field.find(
                  (cellItem) => cellItem.getOrderNum() === cellToSwapOrderNum,
                ) as Cell;
                this.cellsToSwap.push(emptyCell, cellToSwap);
                this.swapElements();
              }
              break;
            }
            default: {
              // Do nothing
            }
          }
          this.cellsToSwap = [];
          break;
        }
        default: {
          // Do nothing
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

    this.clearBoard();
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

  private clearBoard = (): void => {
    const { canvasSize, color } = this.gameConfig;
    this.ctx.fillStyle = color.boardBackgroundColor;
    this.ctx.rect(0, 0, canvasSize, canvasSize);
    this.ctx.fill();
  };

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
    this.calculate(event);
    this.draw();
  };

  private handleOnMouseOut = (event: MouseEvent): void => {
    event.preventDefault();
    this.calculate(event);
    this.draw();
  };

  private handleOnMouseClick = (event: MouseEvent): void => {
    event.preventDefault();
    this.calculate(event);
    this.draw();
  };

  private handleOnKeyDown = (event: KeyboardEvent) => {
    // event.preventDefault();
    this.calculate(event);
    this.draw();
    // const sound = SoundManager.getInstance();
    // sound.playStepSound();
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
    document.addEventListener('keydown', this.handleOnKeyDown);
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
