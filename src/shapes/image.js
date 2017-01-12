
  ;(function() {// eslint-disable-line  

    var image = function(settings) {

      // insert into images
      if(settings.src) {
        !~LCL.images.indexOf(settings.src) && LCL.images.push(settings.src);
      }

      var draw = function() {
        var canvas = LCL.canvas,
          startX = this.startX = settings.startX,
          startY = this.startY = settings.startY,
          src = settings.src;

        canvas.save();
        canvas.translate(this.moveX, this.moveY);
        if(this.fixed) {
          canvas.translate(-LCL.transX, -LCL.transY);
        }
        if(this.sliceWidth && this.sliceHeight) {
          canvas.drawImage(LCL.loader.getImg(src), this.sliceX, this.sliceY, this.sliceWidth, this.sliceHeight, startX, startY, this.width, this.height);
        } else {
          canvas.drawImage(LCL.loader.getImg(src), startX, startY, this.width, this.height);
        }
        canvas.restore();
      };

      return Object.assign({}, LCL.display(settings), {
        type: 'image',
        draw: draw
      });
    };

    LCL.image = image;

  })();