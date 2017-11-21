import display from '../display';

export default function(settings, _this) {
  // insert into images
  if(settings.src) {
    !~_this.images.indexOf(settings.src) && _this.images.push(settings.src);
  }

  let draw = function() {
    let canvas = _this.canvas,
      x = this.x = settings.x,
      y = this.y = settings.y,
      src = settings.src;

    canvas.save();
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    if(this.sliceWidth && this.sliceHeight) {
      canvas.drawImage(_this.loader.getImg(src), this.sliceX, this.sliceY, this.sliceWidth, this.sliceHeight, x, y, this.width, this.height);
    } else {
      canvas.drawImage(_this.loader.getImg(src), x, y, this.width, this.height);
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'image',
    draw: draw
  });
}
