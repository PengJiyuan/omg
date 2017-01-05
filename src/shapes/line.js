
  ;(function() {// eslint-disable-line

    var line = function(settings) {

      var draw = function() {
        var canvas = LCL.canvas,
          startX = settings.startX,
          startY = settings.startY,
          endX = settings.endX,
          endY = settings.endY;

        canvas.save();
        canvas.translate(startX + (endX - startX)/2, startY + (endY - startY)/2);
        canvas.rotate((Math.PI/180)*this.rotate);
        canvas.translate(-(startX + (endX - startX)/2), -(startY + (endY - startY)/2));
        canvas.translate(this.moveX, this.moveY);
        canvas.beginPath();
        canvas.moveTo(startX, startY);
        canvas.lineTo(endX, endY);
        canvas.stroke();
        canvas.closePath();
        canvas.restore();
      };

      return Object.assign({}, LCL.display(settings), {
        type: 'line',
        draw: draw
      });
    };

    LCL.line = line;

  })();