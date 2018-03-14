// from https://github.com/ecomfe/zrender/blob/master/src/contain/line.js
export default (x0, y0, x1, y1, lineWidth, x, y) => {
  if (lineWidth === 0) {
    return false;
  }
  let _l = lineWidth;
  let _a = 0;
  let _b = x0;
  // Quick reject
  if (
    (y > y0 + _l && y > y1 + _l)
    || (y < y0 - _l && y < y1 - _l)
    || (x > x0 + _l && x > x1 + _l)
    || (x < x0 - _l && x < x1 - _l)
  ) {
    return false;
  }

  if (x0 !== x1) {
    _a = (y0 - y1) / (x0 - x1);
    _b = (x0 * y1 - x1 * y0) / (x0 - x1) ;
  }
  else {
    return Math.abs(x - x0) <= _l / 2;
  }
  let tmp = _a * x - y + _b;
  let _s = tmp * tmp / (_a * _a + 1);
  return _s <= _l / 2 * _l / 2;
};
