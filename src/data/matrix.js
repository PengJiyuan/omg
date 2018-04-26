/* @flow */

/**
 * @PengJiyuan
 *
 * Two-dimensional coordinate system
 * Matrix transformation
 */

/**
 * return 3x3 Matrix
 */
const PI = Math.PI;
const COS = Math.cos;
const SIN = Math.sin;
const ABS = Math.abs;

const createTransformMatrix = (originMatrix: Array<number> = [0, 0], angle: number): Array<Array<number>> => {
  const tx = originMatrix[0];
  const ty = originMatrix[1];
  const radian = - (PI / 180 * angle);

  return [
    [COS(radian), -SIN(radian), (1 - COS(radian)) * tx + ty * SIN(radian)],
    [SIN(radian), COS(radian), (1 - COS(radian)) * ty - tx * SIN(radian)],
    [0, 0, 1]
  ];
};

/**
 * a, b, c     x     a*x + b*y + c*1
 * d, e, f  *  y  =  d*x + e*y + f*1
 * g, h, i     1     g*x + h*y + i*1
 */
export const getTransformMatrix = (originMatrix: Array<number>, matrix: Array<Array<number>>, angle: number = 0): Array<Array<number>> => {
  const t = createTransformMatrix(originMatrix, angle);
  const ret = [];
  matrix.forEach(m => {
    const pm = [m[0], m[1], 1];
    const tx = t[0][0] * pm[0] + t[0][1] * pm[1] + t[0][2] * pm[2];
    const ty = t[1][0] * pm[0] + t[1][1] * pm[1] + t[1][2] * pm[2];
    // t[2] = [0, 0, 1]; ignore.
    ret.push([ABS(tx) < 0.0000001 ? 0 : tx, ABS(ty) < 0.0000001 ? 0 : ty]);
  });
  return ret;
};
