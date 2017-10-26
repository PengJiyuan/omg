import display from '../display.js';

export default (settings, _this) => {
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
    let canvas = _this.canvas,
      startX = this.startX = settings.startX,
      startY = this.startY = settings.startY,
      width = settings.width,
      height = settings.height,
      pt = settings.paddingTop ? settings.paddingTop : 0,
      center = settings.center,
      font = settings.font,
      type = settings.type,
      color = settings.color,
      t = this.text,
      textWidth, ellipsisText;

    if(!type) {
      return;
    }
    canvas.save();
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    if(this.backgroundColor) {
      canvas.save();
      canvas.fillStyle = this.backgroundColor;
      canvas.fillRect(startX, startY, width, height);
      canvas.restore();
    }
    canvas.font = font;
    canvas.textBaseline = 'top';

    textWidth = canvas.measureText(t).width;
    ellipsisText = text_ellipsis(canvas, t, width - 8);

    if(type === 'stroke') {
      canvas.strokeStyle = color;
      if(center) {
        if(textWidth < width - 8) {
          canvas.strokeText(ellipsisText, startX + 4 + (width - textWidth - 8)/2, startY + pt);
        }
      } else {
        canvas.strokeText(ellipsisText, startX + 4, startY + pt);
      }
    } else {
      canvas.fillStyle = color;
      if(center) {
        if(textWidth < width - 8) {
          canvas.fillText(ellipsisText, startX + 4 + (width - textWidth - 8)/2, startY + pt);
        }
      } else {
        canvas.fillText(ellipsisText, startX + 4, startY + pt);
      }
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'text',
    draw: draw.bind(display(settings, _this))
  });
}
