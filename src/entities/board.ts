import { range, shuffle, random } from 'lodash';
import Ceil from './cell';
import { BoardInterface } from '../interfaces/board.interface';
import { findRow, findCol } from '../utils';
import { Coords, CellMetrics } from '../types/cell';
import CanvasContext from './canvas-context';
import GameConfig from './game-config';
import GameConfigInstance from '../interfaces/game-config-interface';

export default class Board implements BoardInterface {
  private field: Ceil[];

  private readonly gameConfig: GameConfigInstance;

  private canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.field = Board.generateField();
    this.canvas = CanvasContext.getInstance().canvas;
    this.ctx = CanvasContext.getInstance().context;
    this.intitializeBoard();
    this.gameConfig = GameConfig.getInstance();
  }

  private static generateField(): Ceil[] {
    const randomizedArray = shuffle(range(1, 17));
    const randomEmptyPoint = random(1, 15);
    return randomizedArray.map(
      (item, index) => new Ceil(index + 1, Board.calculateCellCoordsOnCanvas(findCol(index + 1)), Board.calculateCellCoordsOnCanvas(findRow(index + 1)), index !== randomEmptyPoint ? `${item}` : '', index + 1),
    );
  }

  // eslint-disable-next-line class-methods-use-this
  public calculate(): void {
    // console.log('calculating');
  }

  public draw(): void {
    this.field.forEach((ceilItem) => {
      ceilItem.draw();
    });
  }

  private findCeilByCoords = (coords: Coords): Ceil => {
    const { cellSize } = this.gameConfig;
    const ceilByCoords = this.field.find((ceilItem: Ceil) => {
      const { positionX, positionY } = ceilItem.getCellInfo() as CellMetrics;
      return coords.x >= positionX
        && coords.x <= positionX + cellSize
        && coords.y >= positionY
        && coords.y <= positionY + cellSize;
    }) as Ceil;
    return ceilByCoords;
  };

  private handleOnHover = (event: MouseEvent): void => {
    const { canvasSize } = this.gameConfig;

    event.preventDefault();
    this.ctx.clearRect(0, 0, canvasSize, canvasSize);
    this.field.forEach((ceilItem) => {
      ceilItem.unhover();
    });
    // console.log(this.field);
    const hoveredCeilCoords = this.getCoordinatesOnBoard(event);
    const hoveredCeil = this.findCeilByCoords(hoveredCeilCoords);
    hoveredCeil?.hover();
    this.draw();
  };

  private handleOnMouseOut = (event: MouseEvent): void => {
    event.preventDefault();
    const { canvasSize } = this.gameConfig;

    this.ctx.clearRect(0, 0, canvasSize, canvasSize);
    this.field.forEach((ceilItem) => {
      ceilItem.unhover();
    });
    this.draw();
  };

  private getCoordinatesOnBoard = (event: MouseEvent): Coords => {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  private intitializeBoard(): void {
    this.canvas.addEventListener('mousemove', this.handleOnHover);
    this.canvas.addEventListener('mouseout', this.handleOnMouseOut);
  }

  private static calculateCellCoordsOnCanvas = (orderNum: number): number => {
    const { cellSize } = GameConfig.getInstance();
    return (orderNum - 1) * cellSize;
  };

  // private swapElements(firstCeilIndex: number, secondCeilIndex: number): Ceil[] {
  //   const tempArray = [...this.field];
  //   tempArray.push(tempArray[firstCeilIndex]);
  //   tempArray[firstCeilIndex] = {
  //     ...tempArray[firstCeilIndex],
  //     orderNumber: tempArray[secondCeilIndex].orderNumber,
  //   };

  //   tempArray[secondCeilIndex] = {
  //     ...tempArray[secondCeilIndex],
  //     orderNumber: tempArray[tempArray.length - 1].orderNumber,
  //   };
  //   tempArray.pop();
  //   return tempArray;
  // }
}
