import { CellMetrics, HoveringType, SwapMetrics } from '../types/cell';

export default interface CellInterface {
  getCellInfo(): CellMetrics;
  updateCellInfo(cellInfo: SwapMetrics): void;
  draw(): void;
  hover(hoveringType: HoveringType): void;
  unhover(): void;
  click(): void;
  unclick(): void;
  isEmpty(): boolean;
  isHovered(): boolean;
  isClicked(): boolean;
}
