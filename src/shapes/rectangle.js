import display from '../display';

export default function(settings, _this) {
  const draw = function() {
    const canvas = _this.canvas;
    const scale = _this.scale;
    this.scaled_x = this.x * scale;
    this.scaled_y = this.y * scale;
    this.scaled_width = this.width * scale;
    this.scaled_height = this.height * scale;
    this.scaled_moveX = this.moveX * scale;
    this.scaled_moveY = this.moveY * scale;

    canvas.save();
    canvas.translate( this.scaled_x + this.scaled_width / 2 + this.scaled_moveX, this.scaled_y + this.scaled_height / 2 + this.scaled_moveY);
    canvas.rotate((Math.PI/180)*this.rotate);
    canvas.translate(-( this.scaled_x + this.scaled_width / 2 + this.scaled_moveX), -( this.scaled_y + this.scaled_height / 2 + this.scaled_moveY));
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.fillStyle = this.color ? this.color : '#000';
    canvas.fillRect(this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height);
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'rectangle',
    draw: draw,
    rotate: settings.rotate || 0
  });
}
