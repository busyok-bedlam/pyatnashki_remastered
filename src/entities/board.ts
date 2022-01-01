import { range, shuffle, random } from 'lodash';
import Ceil from './ceil';
import { BoardInterface } from '../interfaces/board.interface';
import { findRow, findCol } from '../utils';
import { Coords, CeilMetrics } from '../types/ceil';
import CanvasContext from './canvas-context';

export default class Board implements BoardInterface {
  private field: Ceil[];

  private canvas: HTMLCanvasElement;

  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.field = Board.generateField();
    this.canvas = CanvasContext.getInstance().canvas;
    this.ctx = CanvasContext.getInstance().context;
    this.intitializeBoard();
  }

  private static generateField(): Ceil[] {
    const randomizedArray = shuffle(range(1, 17));
    const randomEmptyPoint = random(1, 15);
    return randomizedArray.map((item, index) => new Ceil(index + 1, findCol(index + 1), findRow(index + 1), index !== randomEmptyPoint ? `${item}` : '', index + 1));
  }

  // eslint-disable-next-line class-methods-use-this
  public calculate(): void {
    // console.log('calculating');
  }

  public draw(): void {
    this.ctx.beginPath();
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(0, 0, 200, 200);
    this.ctx.closePath();
    this.field.forEach((ceilItem) => {
      ceilItem.draw();
    });
  }

  private findCeilByCoords = (coords: Coords): Ceil => {
    const ceilByCoords = this.field.find((ceilItem: Ceil) => {
      const { positionX, positionY } = ceilItem.getMetrics() as CeilMetrics;
      return coords.x >= positionX
        && coords.x <= positionX + 50
        && coords.y >= positionY
        && coords.y <= positionY + 50;
    }) as Ceil;
    return ceilByCoords;
  };

  private handleOnHover = (event: MouseEvent): void => {
    event.preventDefault();
    this.ctx.clearRect(0, 0, 200, 200);
    this.field.forEach((ceilItem) => {
      ceilItem.unhover();
    });
    // console.log(this.field);
    const hoveredCeilCoords = this.getCoordinatesOnBoard(event);
    const hoveredCeil = this.findCeilByCoords(hoveredCeilCoords);
    hoveredCeil.hover();
    this.draw();
  };

  private handleOnMouseOut = (event: MouseEvent): void => {
    event.preventDefault();
    this.ctx.clearRect(0, 0, 200, 200);
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
