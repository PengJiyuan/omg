
  ;(function() {// eslint-disable-line

    var line = function(settings) {

      var _this = this;

      var draw = function() {
        var canvas = _this.canvas,
          matrix = settings.matrix,
          lineWidth = settings.lineWidth,
          dash = settings.dash,
          lineCap = settings.lineCap,
          lineJoin = settings.lineJoin,
          strokeColor = settings.strokeColor;

        canvas.save();
        canvas.translate(-0.5, -0.5);
        canvas.translate(this.moveX, this.moveY);
        if(this.fixed) {
          canvas.translate(-_this.transX, -_this.transY);
        }
        canvas.lineWidth = lineWidth;
        canvas.strokeStyle = strokeColor;
        canvas.beginPath();
        if(dash && Object.prototype.toString.call(dash) === '[object Array]') {
          canvas.setLineDash(dash);
        }
        if(lineCap) {
          canvas.lineCap = lineCap;
        }
        if(lineJoin) {
          canvas.lineJoin = lineJoin;
        }
        matrix.forEach(function(point, i) {
          i === 0 ? canvas.moveTo(point.x, point.y) : canvas.lineTo(point.x, point.y);
        });
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