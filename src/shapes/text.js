/* @flow */

import { display } from '../display';
import { COLOR, FONT_SIZE } from '../data/default';
import { DefineScale } from '../data/define';

export default function(settings: Object, _this: Global): GraghShape {
  // insert into images
  if(settings.background && settings.background.img) {
    !~_this.images.indexOf(settings.background.img) && _this.images.push(settings.background.img);
  }

  function text_ellipsis(ctx, str, maxWidth) {
    let width = ctx.measureText(str).width,
      ellipsis = '...',
      ellipsisWidth = ctx.measureText(ellipsis).width;

    if (width <= maxWidth || width <= ellipsisWidth) {
      return str;
    } else {
      let len = str.length;
      while (width >= maxWidth - ellipsisWidth && len-- > 0) {
        str = str.substring(0, len);
        width = ctx.measureText(str).width;
      }
      return str + ellipsis;
    }
  }

  let draw = function() {
    const canvas = _this.canvas;
    const scale = _this.scale;
    const center = settings.center;
    const fontFamily = settings.fontFamily || 'arial,sans-serif';
    const fontSize = settings.fontSize || FONT_SIZE;
    const fontWeight = settings.fontWeight || 400;
    const size = fontSize * scale;
    const font = `normal ${fontWeight} ${size}px ${fontFamily}`;

    if(!this.fixed) {
      DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY', 'paddingTop', 'paddingLeft');
    }

    let textWidth, ellipsisText;

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }

    if(!this.hide) {
      if(this.background) {
        if(this.background.color) {
          canvas.save();
          canvas.fillStyle = this.background.color;
          canvas.fillRect(this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height);
          canvas.restore();
        } else if(this.background.img) {
          canvas.drawImage(
            _this.loader.getImg(this.background.img),
            this.scaled_x,
            this.scaled_y,
            this.scaled_width,
            this.scaled_height
          );
        }
      }
      canvas.font = font;
      canvas.textBaseline = 'top';

      textWidth = canvas.measureText(this.text).width;
      ellipsisText = text_ellipsis(canvas, this.text, this.scaled_width - 8);

      if(this.style === 'stroke') {
        canvas.strokeStyle = this.color;
        if(center) {
          if(textWidth < this.scaled_width - 8) {
            canvas.strokeText(ellipsisText, this.scaled_x + this.scaled_paddingLeft + (this.scaled_width - textWidth - 8)/2, this.scaled_y + this.scaled_paddingTop);
          }
        } else {
          canvas.strokeText(ellipsisText, this.scaled_x + this.scaled_paddingLeft, this.scaled_y + this.scaled_paddingTop);
        }
      } else {
        canvas.fillStyle = this.color;
        if(center) {
          if(textWidth < this.scaled_width - 8) {
            canvas.fillText(ellipsisText, this.scaled_x + this.scaled_paddingLeft + (this.scaled_width - textWidth - 8)/2, this.scaled_y + this.scaled_paddingTop);
          }
        } else {
          canvas.fillText(ellipsisText, this.scaled_x + this.scaled_paddingLeft, this.scaled_y + this.scaled_paddingTop);
        }
      }
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'rectangle',
    draw: draw,
    color: settings.color || COLOR,
    background: settings.background,
    text: settings.text || 'no text',
    style: settings.style || 'fill',
    paddingTop: settings.paddingTop || 0,
    paddingLeft: settings.paddingLeft || 0,
    scaled_paddingTop: (settings.paddingTop || 0) * _this.scale,
    scaled_paddingLeft: (settings.paddingLeft || 0) * _this.scale
  });
}
