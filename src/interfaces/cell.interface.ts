import { CellMetrics, SwapMetrics } from '../types/cell';

export default interface CellInterface {
  getCellInfo(): CellMetrics;
  updateCellInfo(cellInfo: SwapMetrics): void;
  draw(): void;
  hover(): void;
  unhover(): void;
  click(): void;
  unclick(): void;
  isEmpty(): boolean;
}
