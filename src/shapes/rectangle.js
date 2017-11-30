import display from '../display';

export default function(settings, _this) {
  let draw = function() {
    let canvas = _this.canvas;

    canvas.save();
    canvas.translate( this.x + this.width/2 + this.moveX, this.y + this.height/2 + this.moveY);
    canvas.rotate((Math.PI/180)*this.rotate);
    canvas.translate(-( this.x + this.width/2 + this.moveX), -( this.y + this.height/2 + this.moveY));
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.fillStyle = this.color ? this.color : '#000';
    canvas.fillRect(this.x, this.y, this.width, this.height);
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'rectangle',
    draw: draw,
    rotate: settings.rotate || 0
  });
}
