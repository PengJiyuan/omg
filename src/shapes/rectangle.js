
  ;(function() {// eslint-disable-line  

    var rectangle = function(settings) {

      var _this = this;

      var draw = function() {
        var canvas = _this.canvas;

        canvas.save();
        // canvas.translate( startX + width/2 + this.moveX, startY + height/2 + this.moveY);
        // canvas.rotate((Math.PI/180)*this.rotate);
        // canvas.translate(-( startX + width/2 + this.moveX), -( startY + height/2 + this.moveY));
        canvas.translate(this.moveX, this.moveY);
        if(this.fixed) {
          canvas.translate(-_this.transX, -_this.transY);
        }
        canvas.fillStyle = this.fillColor ? this.fillColor : '#000';
        canvas.fillRect(this.startX, this.startY, this.width, this.height);
        canvas.restore();
      };

      return Object.assign({}, _this.display(settings), {
        type: 'rectangle',
        draw: draw
      });
    };

    LCL.prototype.rectangle = rectangle;

  })();