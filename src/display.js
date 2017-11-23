import isPointInner from './inside';

class Display {

  constructor(settings, _this) {

    this._ = _this;

    this.commonData = {

      color: settings.color,

      x: settings.x,

      y: settings.y,

      width: settings.width,

      height: settings.height,

      moveX: 0,

      moveY: 0,

      zindex: 0

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
    return isPointInner.bind(this)(x, y);
  }

  config(obj) {
    if(Object.prototype.toString.call(obj) !== '[object Object]') {
      return;
    }
    if(obj.drag) {
      this.enableDrag = obj.drag;
    }
    if(obj.changeIndex) {
      this.enableChangeIndex = obj.changeIndex;
    }
    if(obj.fixed) {
      this.fixed = obj.fixed;
    }
    if(obj.bg) {
      this.isBg = obj.bg;
    }
    this.zindex = obj.zindex || 0;

    return this;
  }

  // whether this shape can be dragged
  drag(bool) {
    this.enableDrag = bool;
  };

  // when select this shape, whether it should be changed the index
  changeIndex(bool) {
    this.enableChangeIndex = bool;
  };

}

export default (settings, _this) => {
  const display = new Display(settings, _this);

  return Object.assign({}, display.commonData, {

    isDragging: false,

    hasEnter: false,

    hasDraggedIn: false,

    on: display.on,

    isPointInner: display.isPointInner,

    config: display.config,

    drag: display.drag,

    changeIndex: display.changeIndex,

    _: display._

  });
}
