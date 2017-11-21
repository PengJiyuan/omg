import display from '../display';

export default function(settings, _this) {
  const draw = function() {
    const canvas = _this.canvas,
      x = this.x = settings.x,
      y = this.y = settings.y,
      style = this.style = settings.style,
      startAngle = this.startAngle = settings.startAngle,
      endAngle = this.endAngle = settings.endAngle;

    canvas.save();
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.translate(this.moveX, this.moveY);
    canvas.translate(x, y);
    canvas.beginPath();
    if(!isNaN(startAngle) && !isNaN(endAngle)) {
      canvas.arc(0, 0, this.radius, Math.PI/180*startAngle, Math.PI/180*endAngle, false);
      canvas.save();
      canvas.rotate(Math.PI/180*endAngle);
      canvas.moveTo(this.radius, 0);
      canvas.lineTo(0, 0);
      canvas.restore();
      canvas.rotate(Math.PI/180*startAngle);
      canvas.lineTo(this.radius, 0);
    } else {
      canvas.arc(0, 0, this.radius, 0, Math.PI*2);
    }
    if(style === 'fill') {
      canvas.fillStyle = this.color;
      canvas.fill();
    } else {
      canvas.strokeStyle = this.color;
      canvas.stroke();
    }
    canvas.closePath();
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'arc',
    draw: draw,
    radius: settings.radius
  });
}
