/* @flow */

/**
 * @type: polygon
 *
 * Return true if the given point is contained inside the boundary.
 * See: http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 * @return true if the point is inside the boundary, false otherwise
 */
export default (x: number, y: number, points: Array<Array<number>>): boolean => {
  let result = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    if ((points[i][1] > y) != (points[j][1] > y) &&
        (x < (points[j][0] - points[i][0]) * (y - points[i][1]) / (points[j][1] - points[i][1]) + points[i][0])) {
      result = !result;
    }
  }
  return result;
};
