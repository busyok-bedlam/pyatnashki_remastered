export const findRow = (ceilId: number) => Math.ceil(ceilId / 4);
export const findCol = (ceilId: number) => ceilId % 4 || 4;

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

export const ceilNum = (num: number): number => {
  const powOfNum = num.toString().length - 1;
  const firstNum = Number.parseInt(num.toString()[0], 10);
  return firstNum * (10 ** powOfNum);
};
