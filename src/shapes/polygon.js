import { display } from '../display';
import { COLOR } from '../data/default';
import { DefineScale } from '../data/define';

export default function(settings, _this) {
  const draw = function() {
    const canvas = _this.canvas;
    const scale = _this.scale;

    DefineScale.call(this, scale, 'moveX', 'moveY', 'matrix');

    const matrix = this.scaled_matrix;

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
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
    color: settings.color || COLOR,
    lineWidth: settings.lineWidth || 1,
    matrix: settings.matrix,
    scaled_matrix: settings.matrix
  });
}
