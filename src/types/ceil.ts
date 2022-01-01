export type CeilMetrics = {
  positionX: number;
  positionY: number;
  orderNum: number;
  content: string;
};

export type CoordsMetrics = Pick<CeilMetrics, 'positionX' | 'positionY'>;

export type Coords = { x: number, y: number };
