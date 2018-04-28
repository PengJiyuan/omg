/* @flow */

import { display } from '../display';
import { DefineScale } from '../data/define';

export default function(settings: Object, _this: Global): GraghShape {
  const draw = function() {
    const canvas = _this.canvas;
    const scale = _this.scale;

    if(!this.fixed) {
      DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY', 'radius');
    }

    canvas.save();
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    canvas.translate(this.scaled_x, this.scaled_y);
    if(!this.hide) {
      canvas.beginPath();
      if(!isNaN(this.startAngle) && !isNaN(this.endAngle)) {
        canvas.arc(0, 0, this.scaled_radius, Math.PI / 180 * this.startAngle, Math.PI / 180 * this.endAngle, false);
        canvas.save();
        canvas.rotate(Math.PI / 180 * this.endAngle);
        canvas.moveTo(this.scaled_radius, 0);
        canvas.lineTo(0, 0);
        canvas.restore();
        canvas.rotate(Math.PI / 180 * this.startAngle);
        canvas.lineTo(this.scaled_radius, 0);
      } else {
        canvas.arc(0, 0, this.scaled_radius, 0, Math.PI*2);
      }
      if(this.style === 'fill') {
        canvas.fillStyle = this.color;
        canvas.fill();
      } else {
        canvas.strokeStyle = this.color;
        canvas.stroke();
      }
      canvas.closePath();
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'arc',
    draw: draw,
    style: settings.style,
    startAngle: settings.startAngle,
    endAngle: settings.endAngle,
    radius: settings.radius,
    scaled_radius: settings.radius * _this.scale
  });
}
