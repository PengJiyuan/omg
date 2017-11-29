import polyfill from './utils/polyfill';
import { version } from '../package.json';
import { Event } from './event';
import { Color } from './utils/color';
import { ImageLoader } from './utils/imageLoader';
import autoscale from './utils/autoscale';
import utils from './utils/helpers';
import shapes from './shapes/index';
import { Tween } from './tween/index';

export class OMG {

  constructor(config) {

    this.version = version;

    this.objects = [];

    this.transX = 0;

    this.transY = 0;

    this.scale = 1;

    // the instance of image loader
    this.loader = null;

    this.pointerInnerArray = [];

    this.globalMousedown = void(0);

    this.globalMousemove = void(0);

    this.isDragging = false;

    this.Tween = Tween;

    this.animationList = [];

    this.animationId = null;

    this.animating = false;

    // support event types
    this.eventTypes = [
      'mousedown',
      'mouseup',
      'mouseenter',
      'mouseleave',
      'mousemove',
      'drag',
      'dragend',
      'dragin',
      'dragout',
      'drop'
    ];

    this._event = new Event(this);

    this.color = new Color();

    this.element = config.element;

    this.canvas =  this.element.getContext('2d');

    // // init the width and height
    this.width = config.width;

    this.height = config.height;

    autoscale([this.element], {
      width: this.width,
      height: this.height
    });

    this.enableGlobalTranslate = config.enableGlobalTranslate || false;

    // init images
    this.images = config.images || [];

    this.utils = utils;

    Object.keys(shapes).forEach(shape => {
      this[shape] = function(settings) {
        return shapes[shape](settings, this);
      }
    });

  }

  imgReady() {
    this.loader = new ImageLoader();
    this.loader.addImg(this.images);
  }

  addChild(child) {
    // multi or single
    if(utils.isArr(child)) {
      this.objects = this.objects.concat(child);
    } else {
      this.objects.push(child);
    }
    this.objects.sort((a, b) => {
      return a.zindex - b.zindex;
    });
    // copy the reverse events array
    this._objects = utils.reverse(this.objects);
  }

  removeChild(child) {
    if(utils.isArr(child)) {
      this.objects = this.objects.filter(o => !~child.indexOf(o));
    } else {
      this.objects = this.objects.filter(o => o !== child);
    }
    this._objects = utils.reverse(this.objects);
  }

  removeFirstChild() {
    this.objects.pop();
    this._objects = utils.reverse(this.objects);
  }

  removeLastChild() {
    this.objects.shift();
    this._objects = utils.reverse(this.objects);
  }

  removeAllChilds() {
    this.objects = [];
    this._objects = [];
  }

  show() {
    const _this = this;
    this.imgReady();
    this.loader.ready(() => {
      _this.draw();
      _this._event.triggerEvents();
    });
  }

  draw() {
    this.objects.forEach(item => {
      item.draw();
    });
  }

  redraw() {
    this.clear();
    this.canvas.save();
    this.canvas.translate(this.transX, this.transY);
    this.draw();
    this.canvas.restore();
  }

  clear() {
    this.canvas.clearRect(0, 0, this.width, this.height);
  }

  tick() {
    const func = () => {
      this.animationList.forEach((t, i) => {
        // if finished, remove it
        if(t.finished) {
          this.animationList.splice(i--, 1);
        } else if(t.update) {
          t.update();
        } else {
          t();
        }
      });
      this.redraw();
      this[this.animationId] = requestAnimationFrame(func);
    };
    if(this.animationList.length > 0 && !this.animating) {
      this.animating = true;
      this.animationId = Date.now();
      func();
    } else if(this.animationList.length === 0 && this.animating) {
      this.animating = false;
      cancelAnimationFrame(this.animationId);
    }
    return this.animationId;
  }

  clearAnimation() {
    this.animationList = [];
    this.tick();
  }

  animate(func) {
    this._event.triggerEvents();
    const id = Date.now();
    this.animationList.push(func);
    this.tick();
    return id;
  }

  stop(id) {
    cancelAnimationFrame(this[id]);
  }

  globalTranslate(bool) {
    if(typeof bool !== 'boolean' || !bool) {
      return;
    }
    this.enableGlobalTranslate = true;
  }

  getVersion() {
    return this.version;
  }

  scaleCanvas(bool) {
    if(typeof bool !== 'boolean' || !bool) {
      return;
    }
    const that = this;
    utils.bind(this.element, 'wheel', function(e) {
      if(e.deltaY < 0) {
        if(that.scale <= 3) {
          that.scale += 0.02;
          that.redraw();
        }
      } else {
        if(that.scale > 0.5) {
          that.scale -= 0.02;
          that.redraw();
        }
      }
    });
  }

  mousedown(func) {
    this.globalMousedown = func;
  }

  mousemove(func) {
    this.globalMousemove = func;
  }

}
