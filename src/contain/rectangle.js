/* @flow */

export default (x: number, y: number, recX: number, recY: number, recW: number, recH: number): boolean => {
  const xRight = x > recX;
  const xLeft = x < recX + recW;
  const yTop = y > recY;
  const yBottom = y < recY + recH;

  return xRight && xLeft && yTop && yBottom;
};
