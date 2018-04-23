/* @flow */

/**
 * Define some vars.
 * @includes: set {x, y, width, height, moveX, moveY...} to scaled_xxx.
 *            set {x, y, width, height} to matrix array.
 *            set origin point.
 */
import { getTransformMatrix } from './matrix';

export const DefineScale = function(scale: number, ...args: Array<string>): void {
  args.forEach(a => {
    if(a === 'matrix') {
      this.scaled_matrix = this.matrix.map(m => m.map(n => n * scale));
    } else {
      this[`scaled_${a}`] = this[a] * scale;
    }
  });
};

/**
 * @params: {x, y, width, height}
 * define matrix and origin point.
 */
export const DefineMatrix = function(x: number, y: number, width: number, height: number, rotate?: number): void {
  this.matrix = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height]
  ];
  this.origin = [
    x + 0.5 * width,
    y + 0.5 * height
  ];
  this.scaled_matrix = getTransformMatrix(this.origin, this.matrix, rotate);
};
