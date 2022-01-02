export type CellMetrics = {
  positionX: number;
  positionY: number;
  content: string;
  id: number;
};

export type CoordsMetrics = Pick<CellMetrics, 'positionX' | 'positionY'>;

export type Coords = { x: number, y: number };
