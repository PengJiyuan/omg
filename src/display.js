// No flow check, because flow do not support dynamic assign value.

import isPointInner from './inside';
import getBounding from './clip/bounding';
import { Tween } from './tween/index';
import * as utils from './utils/helpers';

class Display {

  constructor(settings, _this) {

    this._ = _this;

    this.enableDrag = false;
    this.enableChangeIndex = false;
    this.fixed = false;
    this.cliping = false;
    this.zindex = 0;

    // scaled_xxx, the value xxx after scaled, finally display value.
    this.commonData = {

      color: settings.color,

      x: settings.x,

      scaled_x: settings.x * _this.scale,

      y: settings.y,

      scaled_y: settings.y * _this.scale,

      width: settings.width,

      scaled_width: settings.width * _this.scale,

      height: settings.height,

      scaled_height: settings.height * _this.scale,

      moveX: 0,

      scaled_moveX: 0,

      moveY: 0,

      scaled_moveY: 0,

      boundingWidth: 0,

      boundingHeight: 0,

      zindex: 0

    };

  }

  on(eventTypes, callback) {
    if(!eventTypes) {
      throw 'no eventTypes defined!';
    }

    if(!callback || typeof callback !== 'function') {
      throw 'you need defined a callback!';
    }

    this.events = this.events || [];

    const allSupportEventTypes = this._.eventTypes.concat(this._.mobileEventTypes);
    const eTypes = eventTypes.split(' '), that = this;

    eTypes.forEach(event => {
      if(~allSupportEventTypes.indexOf(event)) {
        that.events.push({
          eventType: event,
          callback: callback
        });
      } else {
        throw `${event} is not in eventTypes!\n Please use event in ${allSupportEventTypes}`;
      }
    });

    return this;
  }

  // whether pointer is inner this shape
  isPointInner(x, y) {
    return isPointInner.bind(this)(x, y);
  }

  config(obj) {
    if(!utils.isObj(obj)) {
      return this;
    }
    this.enableDrag = obj.drag || this.enableDrag;
    this.enableChangeIndex = obj.changeIndex || this.enableChangeIndex;
    this.fixed = obj.fixed || this.fixed;
    this.cliping = obj.cliping || this.cliping; // Whether the graphic is animating drawn
    this.zindex = obj.zindex || this.zindex;

    return this;
  }

  animateTo(keys, configs = {}) {
    this.animating = true;
    let data = {};
    const to = keys;
    const from = {};
    for (let key in to) {
      from[key] = this[key];
    }
    data.from = from;
    data.to = to;
    data.onUpdate = (keys) => {
      for (let key in to) {
        this[key] = keys[key];
      }
      configs.onUpdate && configs.onUpdate(keys);
    };
    for(let key in configs) {
      if(key !== 'onUpdate') {
        data[key] = configs[key];
      }
    }
    data.onFinish = () => {
      this.animating = false;
      configs.onFinish && configs.onFinish(keys);
    };
    const tween = new Tween(data);
    this._.animationList.push(tween);
    this._.tick();

    return this;
  }

  // whether this shape can be dragged
  drag(bool) {
    this.enableDrag = bool;
  }

  // when select this shape, whether it should be changed the index
  changeIndex(bool) {
    this.enableChangeIndex = bool;
  }

}

export function display(settings, _this) {
  const display = new Display(settings, _this);

  return Object.assign({}, display.commonData, {

    isDragging: false,

    hasEnter: false,

    hasDraggedIn: false,

    on: display.on,

    animateTo: display.animateTo,

    isPointInner: display.isPointInner,

    config: display.config,

    _: display._,

    isShape: true,

    parent: null,

    hide: settings.hide,

    animating: false,

    // Need to be updated points when added to the group for the second time?
    forceUpdate: false,

    updated: false,

    getBounding() {
      return getBounding(this.scaled_matrix, this.scaled_lineWidth);
    }

  });
}
