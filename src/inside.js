export default function(x, y) {
  const that = this;
  const mx = this.moveX;
  const my = this.moveY;
  const ltx = this.fixed ? 0 : this._.transX;
  const lty = this.fixed ? 0 : this._.transY;
  const xRight = x > this.x + mx + ltx;
  const xLeft = x < this.x + this.width + mx + ltx;
  const yTop = y > this.y + my + lty;
  const yBottom = y < this.y + this.height + my + lty;

  switch(this.type) {

    case 'rectangle':
      return !!(xRight && xLeft && yTop && yBottom);
    case 'arc':
      var cx = this.x, // center x
        cy = this.y, // center y
        pi = Math.PI,
        sa = this.startAngle < 0 ? 2*pi + pi/180*this.startAngle : pi/180*this.startAngle,
        ea = this.endAngle < 0 ? 2*pi + pi/180*this.endAngle : pi/180*this.endAngle,
        r = this.radius,
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
    default:
      break;
  }
}