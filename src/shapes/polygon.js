import display from '../display';

export default function(settings, _this) {
  const draw = function() {
    const canvas = _this.canvas;
    const scale = _this.scale;

    this.scaled_moveX = this.moveX * scale;
    this.scaled_moveY = this.moveY * scale;
    this.scaled_matrix = this.matrix.map(m => m.map(n => n * scale));

    const matrix = this.scaled_matrix;

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
    
    if(this.style === 'fill') {
      canvas.fillStyle = this.color;
      canvas.fill();
    } else {
      canvas.strokeStyle = this.color;
      canvas.lineWidth = this.lineWidth;
      canvas.stroke();
    }
    canvas.closePath();
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'polygon',
    draw: draw,
    style: settings.style || 'fill',
    color: settings.color || '#555',
    lineWidth: settings.lineWidth || 1,
    matrix: settings.matrix,
    scaled_matrix: settings.matrix
  });
}
