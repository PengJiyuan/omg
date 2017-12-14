import { display } from '../display';
import { COLOR, FONT_SIZE } from '../data/default';
import { DefineScale } from '../data/define';

export default function(settings, _this) {
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
    const size = fontSize * scale;
    const font = `${size}px ${fontFamily}`;

    DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY', 'paddingTop');

    let textWidth, ellipsisText;

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    if(this.backgroundColor) {
      canvas.save();
      canvas.fillStyle = this.backgroundColor;
      canvas.fillRect(this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height);
      canvas.restore();
    }
    canvas.font = font;
    canvas.textBaseline = 'top';

    textWidth = canvas.measureText(this.text).width;
    ellipsisText = text_ellipsis(canvas, this.text, this.scaled_width - 8);

    if(this.style === 'stroke') {
      canvas.strokeStyle = this.color;
      if(center) {
        if(textWidth < this.scaled_width - 8) {
          canvas.strokeText(ellipsisText, this.scaled_x + 4 + (this.scaled_width - textWidth - 8)/2, this.scaled_y + this.scaled_paddingTop);
        }
      } else {
        canvas.strokeText(ellipsisText, this.scaled_x + 4, this.scaled_y + this.scaled_paddingTop);
      }
    } else {
      canvas.fillStyle = this.color;
      if(center) {
        if(textWidth < this.scaled_width - 8) {
          canvas.fillText(ellipsisText, this.scaled_x + 4 + (this.scaled_width - textWidth - 8)/2, this.scaled_y + this.scaled_paddingTop);
        }
      } else {
        canvas.fillText(ellipsisText, this.scaled_x + 4, this.scaled_y + this.scaled_paddingTop);
      }
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'rectangle',
    draw: draw,
    color: settings.color || COLOR,
    backgroundColor: settings.backgroundColor,
    text: settings.text || 'no text',
    style: settings.style || 'fill',
    paddingTop: settings.paddingTop || 0,
    scaled_paddingTop: settings.paddingTop ? settings.paddingTop * _this.scale : 0
  });
}
