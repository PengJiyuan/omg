/* @flow */

export default (x: number, y: number, r: number, sa: number, ea: number) => {
  const pi = Math.PI;
  let dis, isIn;
  // Sector
  if(!isNaN(sa) && !isNaN(ea)) {
    let angle = 0;
    // 4th quadrant
    if(x >= 0 && y >= 0) {
      if(x === 0) {
        angle = pi/2;
      } else {
        angle = Math.atan( (y / x) );
      }
    }
    // 3th quadrant
    else if(x <= 0 && y >= 0) {
      if(x === 0) {
        angle = pi;
      } else {
        angle = pi - Math.atan(y / Math.abs(x));
      }
    }
    // secend quadrant
    else if(x <= 0 && y <= 0) {
      if(x === 0) {
        angle = pi;
      } else {
        angle = Math.atan(Math.abs(y) / Math.abs(x)) + pi;
      }
    }
    // first quadrant
    else if(x >= 0 && y<= 0) {
      if(x === 0) {
        angle = pi*3/2;
      } else {
        angle = 2*pi - Math.atan(Math.abs(y) / x);
      }
    }
    dis = Math.sqrt( x * x + y * y );
    if(sa < ea) {
      isIn = !!(angle >= sa && angle <= ea && dis <= r);
    } else {
      isIn = !!( ( (angle >= 0 && angle <= ea) || (angle >= sa && angle <= 2*pi) ) && dis <= r);
    }
  }
  // normal arc
  else {
    isIn = !!( Math.sqrt( x * x + y * y ) <= r );
  }
  return isIn;
};
