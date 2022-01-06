export type CellMetrics = {
  positionX: number;
  positionY: number;
  content: string;
  id: number;
  orderNum: number;
};

export type CoordsMetrics = Pick<CellMetrics, 'positionX' | 'positionY'>;

export type SwapMetrics = Pick<CellMetrics, 'id' | 'content'>;

export type Coords = { x: number, y: number };
