
  ;(function() {// eslint-disable-line

    var line = function(settings) {

      var _this = this;

      var draw = function() {
        var canvas = _this.canvas,
          matrix = settings.matrix,
          lineWidth = settings.lineWidth,
          lineCap = settings.lineCap,
          lineJoin = settings.lineJoin,
          strokeColor = settings.strokeColor,
          smooth = settings.smooth;

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
          var getCtrlPoint = function(ps, i, a, b) {
            var pAx, pAy, pBx, pBy;
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
              var last = ps.length-1;
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
          for(var i = 0; i < matrix.length; i++) {
            if(i === 0){
              canvas.moveTo(matrix[i].x, matrix[i].y);
            }else{
              var cMatrix = getCtrlPoint(matrix, i-1);
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

      return Object.assign({}, _this.display(settings), {
        type: 'line',
        draw: draw
      });
    };

    LCL.prototype.line = line;

  })();