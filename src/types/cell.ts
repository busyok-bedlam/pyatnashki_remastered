export type CellMetrics = {
  positionX: number;
  positionY: number;
  content: string;
  id: number;
  orderNum: number;
};

export type CoordsMetrics = Pick<CellMetrics, 'positionX' | 'positionY'>;

export type SwapMetrics = Pick<CellMetrics, 'id' | 'content'>;

export type HoveringType = 'compared' | 'uncompared' | 'default';

export type CellStatus = 'clicked' | 'hovered' | 'default';

export enum CellStatuses {
  clicked = 'clicked',
  hovered = 'hovered',
  default = 'default',
}

export type Coords = { x: number, y: number };

export enum HoveringTypes {
  compared = 'compared',
  uncompared = 'uncompared',
  default = 'default',
}
