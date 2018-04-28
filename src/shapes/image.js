/* @flow */

import { display } from '../display';
import { DefineScale } from '../data/define';

export default function(settings: Object, _this: Global): GraghShape {
  // insert into images
  if(settings.src) {
    !~_this.images.indexOf(settings.src) && _this.images.push(settings.src);
  }

  let draw = function() {
    const canvas = _this.canvas;
    const src = settings.src;
    const scale = _this.scale;

    if(!this.fixed) {
      DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY');
    }

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    try {
      if(!this.hide) {
        if (this.sliceWidth && this.sliceHeight) {
          canvas.drawImage(
            _this.loader.getImg(src),
            this.sliceX,
            this.sliceY,
            this.sliceWidth,
            this.sliceHeight,
            this.scaled_x,
            this.scaled_y,
            this.scaled_width,
            this.scaled_height
          );
        } else {
          canvas.drawImage(
            _this.loader.getImg(src),
            this.scaled_x,
            this.scaled_y,
            this.scaled_width,
            this.scaled_height
          );
        }
      }
    } catch (error) {
      throw new Error('The picture is not loaded successfully, please check the picture url : ' + src);
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'rectangle',
    draw: draw,
    sliceWidth: settings.sliceWidth,
    sliceHeight: settings.sliceHeight,
    sliceX: settings.sliceX,
    sliceY: settings.sliceY
  });
}
