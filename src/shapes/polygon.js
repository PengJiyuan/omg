import display from '../display';

export default function(settings, _this) {
  const canvas = _this.canvas,
    matrix = settings.matrix,
    color = settings.color,
    lineWidth = settings.lineWidth || 1,
    type = settings.type || 'fill';

  const draw = function() {

    canvas.save();
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.beginPath();

    matrix.forEach((point, i) => {
      i === 0 ? canvas.moveTo(point[0], point[1]) : canvas.lineTo(point[0], point[1]);
    });
    canvas.lineTo(matrix[0][0], matrix[0][1]);
    
    if(type === 'fill') {
      canvas.fillStyle = color;
      canvas.fill();
    } else {
      canvas.strokeStyle = color;
      canvas.lineWidth = lineWidth;
      canvas.stroke();
    }
    canvas.closePath();
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'polygon',
    draw: draw
  });
}
