
  ;(function() {// eslint-disable-line  

    var rectangle = function(settings) {

      var draw = function() {
        var canvas = LCL.canvas,
          startX = this.startX = settings.startX,
          startY = this.startY = settings.startY,
          width = this.width = settings.width,
          height = this.height = settings.height;

        canvas.save();
        // canvas.translate( startX + width/2 + this.moveX, startY + height/2 + this.moveY);
        // canvas.rotate((Math.PI/180)*this.rotate);
        // canvas.translate(-( startX + width/2 + this.moveX), -( startY + height/2 + this.moveY));
        canvas.translate(this.moveX, this.moveY);
        if(this.fixed) {
          canvas.translate(-LCL.transX, -LCL.transY);
        }
        canvas.fillStyle = this.fillColor ? this.fillColor : '#000';
        canvas.fillRect(startX, startY, width, height);
        canvas.restore();
      };

      return Object.assign({}, LCL.display(settings), {
        type: 'rectangle',
        draw: draw
      });
    };

    LCL.rectangle = rectangle;

  })();