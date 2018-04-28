/* @flow */

import { display } from '../display';
import { COLOR, RADIUS } from '../data/default';
import { DefineScale, DefineMatrix } from '../data/define';
import clip from '../clip/index';

export default function(settings: Object, _this: Global): GraghShape {
  const draw = function() {
    const canvas = _this.canvas;
    const scale = _this.scale;

    if(!this.fixed) {
      DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY');
    }
    DefineMatrix.call(this, this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height, this.rotate);

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);

    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    // clip path
    clip(this, canvas, scale);

    if(!this.hide) {
      canvas.beginPath();
      const matrix = this.scaled_matrix;
      const radius = this.radius;

      canvas.moveTo(matrix[0][0] + radius.tl * scale, matrix[0][1]);
      canvas.lineTo(matrix[1][0] - radius.tr * scale, matrix[0][1]);
      canvas.quadraticCurveTo(matrix[1][0], matrix[0][1], matrix[1][0], matrix[0][1] + radius.tr * scale);
      canvas.lineTo(matrix[1][0], matrix[2][1] - radius.br * scale);
      canvas.quadraticCurveTo(matrix[1][0], matrix[2][1], matrix[1][0] - radius.br * scale, matrix[2][1]);
      canvas.lineTo(matrix[0][0] + radius.bl * scale, matrix[2][1]);
      canvas.quadraticCurveTo(matrix[0][0], matrix[2][1], matrix[0][0], matrix[2][1] - radius.bl * scale);
      canvas.lineTo(matrix[0][0], matrix[0][1] + radius.tl * scale);
      canvas.quadraticCurveTo(matrix[0][0], matrix[0][1], matrix[0][0] + radius.tl * scale, matrix[0][1]);

      if(this.style !== 'stroke') {
        canvas.fillStyle = this.color || COLOR;
        canvas.fill();
      } else {
        canvas.strokeStyle = this.color || COLOR;
        canvas.lineWidth = this.lineWidth;
        canvas.stroke();
      }
      canvas.closePath();
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'polygon',
    draw: draw,
    rotate: !settings.radius ? settings.rotate : 0,
    radius: settings.radius || RADIUS
  });
}
