import display from '../display.js';

export default (settings, _this) => {
  let canvas = _this.canvas,
    matrix = settings.matrix,
    lineWidth = settings.lineWidth,
    lineCap = settings.lineCap,
    lineJoin = settings.lineJoin,
    strokeColor = settings.strokeColor,
    smooth = settings.smooth;

  let totalLength;

  let draw = function() {

    canvas.save();
    canvas.translate(-0.5, -0.5);
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.lineWidth = lineWidth;
    canvas.strokeStyle = strokeColor;
    canvas.beginPath();
    canvas.lineDashOffset = this.offset;
    if(this.dash && Object.prototype.toString.call(this.dash) === '[object Array]') {
      canvas.setLineDash(this.dash);
    }
    if(lineCap) {
      canvas.lineCap = lineCap;
    }
    if(lineJoin) {
      canvas.lineJoin = lineJoin;
    }
    if(smooth) {
      let getCtrlPoint = function(ps, i, a, b) {
        let pAx, pAy, pBx, pBy;
        if(!a || !b){
          a = 0.25;
          b = 0.25;
        }
        if( i < 1){
          pAx = ps[0].x + (ps[1].x - ps[0].x)*a;
          pAy = ps[0].y + (ps[1].y - ps[0].y)*a;
        }else{
          pAx = ps[i].x + (ps[i+1].x - ps[i-1].x)*a;
          pAy = ps[i].y + (ps[i+1].y - ps[i-1].y)*a;
        }
        if(i > ps.length-3){
          let last = ps.length-1;
          pBx = ps[last].x - (ps[last].x - ps[last-1].x) * b;
          pBy = ps[last].y - (ps[last].y - ps[last-1].y) * b;
        }else{
          pBx = ps[i + 1].x - (ps[i + 2].x - ps[i].x) * b;
          pBy = ps[i + 1].y - (ps[i + 2].y - ps[i].y) * b;
        }
        return {
          pA:{x: pAx, y: pAy},
          pB:{x: pBx, y: pBy}
        };
      };
      for(let i = 0; i < matrix.length; i++) {
        if(i === 0){
          canvas.moveTo(matrix[i].x, matrix[i].y);
        }else{
          let cMatrix = getCtrlPoint(matrix, i-1);
          canvas.bezierCurveTo(cMatrix.pA.x, cMatrix.pA.y, cMatrix.pB.x, cMatrix.pB.y, matrix[i].x, matrix[i].y);
        }
      }
    } else {
      matrix.forEach(function(point, i) {
        i === 0 ? canvas.moveTo(point.x, point.y) : canvas.lineTo(point.x, point.y);
      });
    }
    canvas.stroke();
    canvas.closePath();
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'line',
    draw: draw.bind(display(settings, _this)),
    totalLength: totalLength
  });
}
