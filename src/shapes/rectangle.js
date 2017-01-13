
  ;(function() {// eslint-disable-line  

    var rectangle = function(settings) {

      var _this = this;

      var draw = function() {
        var canvas = _this.canvas,
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
          canvas.translate(-_this.transX, -_this.transY);
        }
        canvas.fillStyle = this.fillColor ? this.fillColor : '#000';
        canvas.fillRect(startX, startY, width, height);
        canvas.restore();
      };

      return Object.assign({}, _this.display(settings), {
        type: 'rectangle',
        draw: draw
      });
    };

    LCL.prototype.rectangle = rectangle;

  })();