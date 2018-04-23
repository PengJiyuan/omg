/* @flow */

import * as utils from '../utils/helpers';

/**
 * @param {Array}  points - point list
 * @return {Array} bounding points. left top, right top, right bottom, left bottom.
 */
function getBounding(points: Array<Array<number>>, lineWidth: number) {
  const lw = lineWidth ? lineWidth : 0;
  const xList = points.map(point => point[0]);
  const yList = points.map(point => point[1]);
  const minX = utils.getMin(xList) - lw;
  const maxX = utils.getMax(xList) + lw;
  const minY = utils.getMin(yList) - lw;
  const maxY = utils.getMax(yList) + lw;
  const lt = [minX, minY];
  const lb = [minX, maxY];
  const rt = [maxX, minY];
  const rb = [maxX, maxY];
  const w = maxX - minX;
  const h = maxY - minY;
  return {
    lt,
    rt,
    rb,
    lb,
    w,
    h
  };
}

export default getBounding;
