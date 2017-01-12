
  ;(function() {// eslint-disable-line

    var arc = function(settings) {

      var draw = function() {
        var canvas = LCL.canvas,
          x = this.x = settings.x,
          y = this.y = settings.y,
          color = this.color = settings.color,
          type = settings.type,
          radius = this.radius = settings.radius;

        canvas.save();
        if(this.fixed) {
          canvas.translate(-LCL.transX, -LCL.transY);
        }
        canvas.translate(this.moveX, this.moveY);
        canvas.beginPath();
        canvas.arc(x, y, radius, 0, 2*Math.PI, false);
        if(type === 'fill') {
          canvas.fillStyle = color;
          canvas.fill();
        } else {
          canvas.strokeStyle = color;
          canvas.stroke();
        }
        canvas.closePath();
        canvas.restore();
      };

      return Object.assign({}, LCL.display(settings), {
        type: 'arc',
        draw: draw
      });
    };

    LCL.arc = arc;

  })();