export default function(x, y) {
  const that = this;
  const mx = this.moveX * this._.scale;
  const my = this.moveY * this._.scale;
  const ltx = this.fixed ? 0 : this._.transX;
  const lty = this.fixed ? 0 : this._.transY;
  const xRight = x > this.scaled_x + mx + ltx;
  const xLeft = x < this.scaled_x + this.scaled_width + mx + ltx;
  const yTop = y > this.scaled_y + my + lty;
  const yBottom = y < this.scaled_y + this.scaled_height + my + lty;

  switch(this.type) {
    /**
     * @type: image, text, coord
     */
    case 'rectangle':
      return !!(xRight && xLeft && yTop && yBottom);
    /**
     * @type: Arc
     */
    case 'arc':
      var cx = this.scaled_x, // center x
        cy = this.scaled_y, // center y
        pi = Math.PI,
        sa = this.startAngle < 0 ? 2 * pi + pi / 180 * this.startAngle : pi / 180 * this.startAngle,
        ea = this.endAngle < 0 ? 2 * pi + pi / 180 * this.endAngle : pi / 180 * this.endAngle,
        r = this.scaled_radius,
        dx = x - cx - mx -ltx,
        dy = y - cy - my - lty,
        isIn, dis;
      // Sector
      if(!isNaN(sa) && !isNaN(ea)) {
        var angle;
        // 4th quadrant
        if(dx >= 0 && dy >= 0) {
          if(dx === 0) {
            angle = pi/2;
          } else {
            angle = Math.atan( (dy / dx) );
          }
        }
        // 3th quadrant
        else if(dx <= 0 && dy >= 0) {
          if(dx === 0) {
            angle = pi;
          } else {
            angle = pi - Math.atan(dy / Math.abs(dx));
          }
        }
        // secend quadrant
        else if(dx <= 0 && dy <= 0) {
          if(dx === 0) {
            angle = pi;
          } else {
            angle = Math.atan(Math.abs(dy) / Math.abs(dx)) + pi;
          }
        }
        // first quadrant
        else if(dx >= 0 && dy<= 0) {
          if(dx === 0) {
            angle = pi*3/2;
          } else {
            angle = 2*pi - Math.atan(Math.abs(dy) / dx);
          }
        }
        dis = Math.sqrt( dx * dx + dy * dy );
        if(sa < ea) {
          isIn = !!(angle >= sa && angle <= ea && dis <= r);
        } else {
          isIn = !!( ( (angle >= 0 && angle <= ea) || (angle >= sa && angle <= 2*pi) ) && dis <= r);
        }
      }
      // normal arc
      else {
        isIn = !!( Math.sqrt( dx * dx + dy * dy ) <= r );
      }
      return isIn;
    /**
     * @type: polygon
     *
     * Return true if the given point is contained inside the boundary.
     * See: http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
     * @return true if the point is inside the boundary, false otherwise
     */
    case 'polygon':
      const points = this.scaled_matrix;
      const pgx = x - mx - ltx;
      const pgy = y - my - lty;
      let result = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        if ((points[i][1] > pgy) != (points[j][1] > pgy) &&
            (pgx < (points[j][0] - points[i][0]) * (pgy - points[i][1]) / (points[j][1] - points[i][1]) + points[i][0])) {
          result = !result;
        }
      }
      return result;
    default:
      break;
  }
}