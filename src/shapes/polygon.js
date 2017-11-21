import display from '../display';

export default function(settings, _this) {
  const canvas = _this.canvas,
    lineWidth = settings.lineWidth || 1,
    type = settings.type || 'fill';

  const draw = function() {

    canvas.save();
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.beginPath();

    this.matrix.forEach((point, i) => {
      i === 0 ? canvas.moveTo(point[0], point[1]) : canvas.lineTo(point[0], point[1]);
    });
    canvas.lineTo(this.matrix[0][0], this.matrix[0][1]);
    
    if(type === 'fill') {
      canvas.fillStyle = this.color;
      canvas.fill();
    } else {
      canvas.strokeStyle = this.color;
      canvas.lineWidth = lineWidth;
      canvas.stroke();
    }
    canvas.closePath();
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'polygon',
    draw: draw,
    matrix: settings.matrix
  });
}
