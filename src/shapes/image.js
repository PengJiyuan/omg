import display from '../display';

export default function(settings, _this) {
  // insert into images
  if(settings.src) {
    !~_this.images.indexOf(settings.src) && _this.images.push(settings.src);
  }

  let draw = function() {
    const canvas = _this.canvas;
    const src = settings.src;
    const scale = _this.scale;

    this.scaled_x = this.x * scale;
    this.scaled_y = this.y * scale;
    this.scaled_width = this.width * scale;
    this.scaled_height = this.height * scale;
    this.scaled_moveX = this.moveX * scale;
    this.scaled_moveY = this.moveY * scale;

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    if(this.sliceWidth && this.sliceHeight) {
      canvas.drawImage(
        _this.loader.getImg(src),
        this.sliceX,
        this.sliceY,
        this.sliceWidth,
        this.sliceHeight,
        this.scaled_x,
        this.scaled_y,
        this.scaled_width,
        this.scaled_height
      );
    } else {
      canvas.drawImage(
        _this.loader.getImg(src),
        this.scaled_x,
        this.scaled_y,
        this.scaled_width,
        this.scaled_height
      );
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'rectangle',
    draw: draw,
    sliceWidth: settings.sliceWidth,
    sliceHeight: settings.sliceHeight,
    sliceX: settings.sliceX,
    sliceY: settings.sliceY
  });
}
