/* @flow */

import insideRectangle from './contain/rectangle';
import insideLine from './contain/line';
import insideArc from './contain/arc';
import insidePolygon from './contain/polygon';

export default function(x: number, y: number): boolean | void {
  // 图形内部偏移的像素
  const mx = this.moveX * this._.scale;
  const my = this.moveY * this._.scale;
  // 全局偏移的像素
  const ltx = this.fixed ? 0 : this._.transX;
  const lty = this.fixed ? 0 : this._.transY;
  // 鼠标获取到的坐标减去全局偏移像素和图形内部偏移的像素
  const pgx = x - mx - ltx;
  const pgy = y - my - lty;

  switch(this.type) {
    /**
     * @type: image, text, coord
     */
    case 'rectangle':
    case 'group':
      return insideRectangle(pgx, pgy, this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height);
    /**
     * @type: Arc
     */
    case 'arc':
      var cx = this.scaled_x, // 圆心x
        cy = this.scaled_y, // 圆心y
        pi = Math.PI,
        // 将度数转化为PI角度
        sa = this.startAngle < 0 ? 2 * pi + pi / 180 * this.startAngle : pi / 180 * this.startAngle,
        ea = this.endAngle < 0 ? 2 * pi + pi / 180 * this.endAngle : pi / 180 * this.endAngle,
        r = this.scaled_radius,
        dx = pgx - cx,
        dy = pgy - cy;
      return insideArc(dx, dy, r, sa, ea);
    /**
     * @type: polygon
     */
    case 'polygon':
      return insidePolygon(pgx, pgy, this.scaled_matrix);
    /**
     * @type: line
     */
    case 'line':
      const linePoints = this.scaled_matrix;
      const length = linePoints.length;
      for (let i = 0;i < length; i ++) {
        if(i > 0) {
          if(insideLine(
            linePoints[i - 1][0],
            linePoints[i - 1][1],
            linePoints[i][0],
            linePoints[i][1],
            this.scaled_lineWidth,
            pgx,
            pgy
          )) {
            return true;
          }
        }
      }
      return false;
    default:
      break;
  }
}
