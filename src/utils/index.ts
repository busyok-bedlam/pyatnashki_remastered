export const findRow = (ceilId: number) => Math.ceil(ceilId / 4);
export const findCol = (ceilId: number) => ceilId % 4 || 4;

const isOnOneRow = (id1: number, id2: number) => findRow(id1) === findRow(id2);
const isOnOneColumn = (id1: number, id2: number) => findCol(id1) === findCol(id2);

export const getCeilPositionX = (ceilId: number) => (ceilId - 4 * (findRow(ceilId) - 1));

export const getCeilPositionY = (cellId: number) => (Math.ceil((cellId - 4) / 4) + 1);

export const calculateCanvasCoords = (orderNum: number): number => (orderNum - 1) * 50;

export const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
};

export const getCoordsOnBorder = (ev: MouseEvent) => ({ x: ev.clientX, y: ev.clientY });
export const isNeighbour = (ceilIdFirst: number, ceilIdSecond: number) => {
  if (isOnOneRow(ceilIdFirst, ceilIdSecond)) {
    const isNeighbourByX = Math.abs(
      getCeilPositionX(ceilIdFirst) - getCeilPositionX(ceilIdSecond),
    ) === 1;
    if (isNeighbourByX) {
      return true;
    }
  } else if (isOnOneColumn(ceilIdFirst, ceilIdSecond)) {
    const isNeighbourByY = Math.abs(
      getCeilPositionY(ceilIdFirst) - getCeilPositionY(ceilIdSecond),
    ) === 1;
    if (isNeighbourByY) {
      return true;
    }
  }
  return false;
};

export const ceilNum = (num: number): number => {
  const powOfNum = num.toString().length - 1;
  const firstNum = Number.parseInt(num.toString()[0], 10);
  return firstNum * (10 ** powOfNum);
};

// export const calculateRestOfDigit = (num: number): number => {
//   const ceildedNumber
// }
