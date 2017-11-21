import isPointInner from './inside';

class Display {

  constructor(settings, _this) {

    this._ = _this;

    this.settingsData = {

      color: settings.color, // arc

      x: settings.x,

      y: settings.y,

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
    return isPointInner.bind(this)(x, y);
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
