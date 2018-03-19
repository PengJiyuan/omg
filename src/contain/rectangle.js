export default (x, y, recX, recY, recW, recH) => {
  const xRight = x > recX;
  const xLeft = x < recX + recW;
  const yTop = y > recY;
  const yBottom = y < recY + recH;

  return xRight && xLeft && yTop && yBottom;
};
