class Display {

  constructor(settings, _this) {

    this._ = _this;

    this.settingsData = {

      color: settings.color, // arc

      startX: settings.startX,

      startY: settings.startY,

      dash: settings.dash, // line

      offset: settings.offset ? settings.offset : 0, // line

      fillColor: settings.fillColor, // rectangle fillcolor

      sliceX: settings.sliceX, // image sliceX

      sliceY: settings.sliceY, // image sliceY

      width: settings.width, // image

      height: settings.height, // image

      sliceWidth: settings.sliceWidth, // image

      sliceHeight: settings.sliceHeight, // image

      backgroundColor: settings.backgroundColor, //text

      text: settings.text, // text,

      radius: settings.radius //arc

    };

  }

  on(eventTypes, callback) {
    if(this.isBg) {
      return;
    }

    if(!eventTypes) {
      throw 'no eventTypes defined!';
    }

    if(!callback || typeof callback !== 'function') {
      throw 'you need defined a callback!';
    }

    this.events = this.events || [];

    const eTypes = eventTypes.split(' '), that = this;

    eTypes.forEach(event => {
      if(~this._.eventTypes.indexOf(event)) {
        that.events.push({
          eventType: event,
          callback: callback
        });
      } else {
        console.error(event + ' is not in eventTypes!');
      }
    });

    return this;
  }

  // whether pointer is inner this shape
  isPointInner(x, y) {
    const that = this;
    const mx = this.moveX;
    const my = this.moveY;
    const ltx = this.fixed ? 0 : this._.transX;
    const lty = this.fixed ? 0 : this._.transY;
    const xRight = x > this.startX + mx + ltx;
    const xLeft = x < this.startX + this.width + mx + ltx;
    const yTop = y > this.startY + my + lty;
    const yBottom = y < this.startY + this.height + my + lty;

    switch(this.type) {

      case 'rectangle':
      case 'image':
      case 'text':
      case 'coord':
        return !!(xRight && xLeft && yTop && yBottom);
      case 'arc':
        var cx = this.x, // center x
          cy = this.y, // center y
          pi = Math.PI,
          sa = this.startAngle < 0 ? 2*pi + pi/180*this.startAngle : pi/180*this.startAngle,
          ea = this.endAngle < 0 ? 2*pi + pi/180*this.endAngle : pi/180*this.endAngle,
          r = this.radius,
          dx = x - cx - mx -ltx,
          dy = y - cy - my - lty,
          isIn, dis;
        // Sector
        if(!isNaN(sa) && !isNaN(ea)) {
          var angle;
          // 4th quadrant
          if(dx >= 0 && dy >= 0) {
            if(dx === 0) {
              angle = pi/2;
            } else {
              angle = Math.atan( (dy / dx) );
            }
          }
          // 3th quadrant
          else if(dx <= 0 && dy >= 0) {
            if(dx === 0) {
              angle = pi;
            } else {
              angle = pi - Math.atan(dy / Math.abs(dx));
            }
          }
          // secend quadrant
          else if(dx <= 0 && dy <= 0) {
            if(dx === 0) {
              angle = pi;
            } else {
              angle = Math.atan(Math.abs(dy) / Math.abs(dx)) + pi;
            }
          }
          // first quadrant
          else if(dx >= 0 && dy<= 0) {
            if(dx === 0) {
              angle = pi*3/2;
            } else {
              angle = 2*pi - Math.atan(Math.abs(dy) / dx);
            }
          }
          dis = Math.sqrt( dx * dx + dy * dy );
          if(sa < ea) {
            isIn = !!(angle >= sa && angle <= ea && dis <= r);
          } else {
            isIn = !!( ( (angle >= 0 && angle <= ea) || (angle >= sa && angle <= 2*pi) ) && dis <= r);
          }
        }
        // normal arc
        else {
          isIn = !!( Math.sqrt( dx * dx + dy * dy ) <= r );
        }
        return isIn;
      default:
        break;
    }

    // expand isPointerInner
    // const arr = that.pointerInnerArray;
    // for(let i = 0; i < arr.length; i++) {
    //   if(that.type === arr[i].type) {
    //     return arr[i].isPointInner(that, x, y);
    //   }
    // }
  }

  config(obj) {
    if(Object.prototype.toString.call(obj) !== '[object Object]') {
      return;
    }
    if(obj.drag) {
      this.enableDrag = true;
    }
    if(obj.changeIndex) {
      this.enableChangeIndex = true;
    }
    if(obj.fixed) {
      this.fixed = true;
    }
    if(obj.bg) {
      this.isBg = true;
    }
    this.zindex = obj.zindex ? obj.zindex : 0;
    return this;
  }

  // whether this shape can be dragged
  drag(bool) {
    if(!bool || typeof bool !== 'boolean') {
      return;
    }
    this.enableDrag = true;
  };

  // when select this shape, whether it should be changed the index
  changeIndex(bool) {
    if(!bool || typeof bool !== 'boolean') {
      return;
    }
    this.enableChangeIndex = true;
  };

}

export default (settings, _this) => {
  const display = new Display(settings, _this);

  return Object.assign({}, display.settingsData, {

    isDragging: false,

    hasEnter: false,

    hasDraggedIn: false,

    moveX: 0,

    moveY: 0,

    zindex: 0,

    on: display.on,

    isPointInner: display.isPointInner,

    config: display.config,

    drag: display.drag,

    changeIndex: display.changeIndex,

    _: display._

  });
}
