import { display } from '../display';
import { COLOR } from '../data/default';
import { DefineScale, DefineMatrix } from '../data/define';

export default function(settings, _this) {
  const draw = function() {
    const canvas = _this.canvas;
    const scale = _this.scale;

    DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY');
    DefineMatrix.call(this, this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height, this.rotate);

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);

    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.beginPath();

    this.scaled_matrix.forEach((point, i) => {
      i === 0 ? canvas.moveTo(point[0], point[1]) : canvas.lineTo(point[0], point[1]);
    });
    canvas.lineTo(this.scaled_matrix[0][0], this.scaled_matrix[0][1]);
    
    if(this.style !== 'stroke') {
      canvas.fillStyle = this.color || COLOR;
      canvas.fill();
    } else {
      canvas.strokeStyle = this.color || COLOR;
      canvas.lineWidth = this.lineWidth;
      canvas.stroke();
    }
    canvas.closePath();
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'polygon',
    draw: draw,
    rotate: settings.rotate || 0
  });
}
