import { CellMetrics } from '../types/cell';

export default interface CellInterface {
  getCellInfo(): CellMetrics;
  updateCellInfo(cellInfo: CellMetrics): void;
  draw(): void;
  hover(): void;
  unhover(): void;
}
