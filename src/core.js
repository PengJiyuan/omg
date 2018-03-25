import './utils/polyfill';
import { version } from '../package.json';
import { Event } from './event';
import { Color } from './utils/color';
import { ImageLoader } from './utils/imageLoader';
import autoscale from './utils/autoscale';
import utils from './utils/helpers';
import shapes from './shapes/index';
import group from './group/index';
import { Tween } from './tween/index';
import * as ext from './extend/export';

export class OMG {

  constructor(config) {

    this.version = version;

    this.objects = [];

    this.transX = 0;

    this.transY = 0;

    this.deviceScale = 1;

    this.minDeviceScale = 0.5 * this.deviceScale;

    this.maxDeviceScale = 4 * this.deviceScale;

    this.scale = this.deviceScale;

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

    this.fpsFunc = null;

    this.fps = 0;

    this.fpsCacheTime = 0;

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

    // init the width and height
    this.width = config.width;

    this.height = config.height;

    autoscale([this.element], {
      width: this.width,
      height: this.height
    });

    /**
     * @description: For extend shapes.
     *               Export functions to define scale and drag events...
     */
    this.ext = ext;

    // enable global drag event.
    this.enableGlobalTranslate = config.enableGlobalTranslate || false;

    // enable global scale event.
    this.enableGlobalScale = config.enableGlobalScale || false;

    // init images
    this.images = config.images || [];

    this.utils = utils;

    this.shapes = shapes;

  }

  init() {
    Object.keys(this.shapes).forEach(shape => {
      this[shape] = function(settings) {
        return this.shapes[shape](settings, this);
      };
    });
    this.group = function(settings) {
      return group(settings, this);
    };
  }

  extend(ext) {
    for (let key in ext) {
      this.shapes[key] = ext[key];
    }
  }

  imgReady() {
    this.loader = new ImageLoader();
    this.loader.addImg(this.images);
  }

  addChild(child) {
    // multi or single
    if(utils.isArr(child)) {
      this.objects = this.objects.concat(child);
      child.forEach(c => {
        // if type is group, push it's children to objects
        if(c.children && c.children.length > 0) {
          this.objects = this.objects.concat(c.children);
        }
      });
    } else {
      this.objects.push(child);
      if(child.children && child.children.length > 0) {
        this.objects = this.objects.concat(child.children);
      }
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
      if(this.fpsFunc) {
        const now = Date.now();
        if(now - this.fpsCacheTime >= 1000) {
          this.fpsFunc(this.fps);
          this.fps = 0;
          this.fpsCacheTime = now;
        } else {
          this.fps++;
        }
      }
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
      if(this.animationList.length === 0 && this.animating) {
        this.animating = false;
        cancelAnimationFrame(this[this.animationId]);
      } else {
        this[this.animationId] = requestAnimationFrame(func);
      }
    };
    if(this.animationList.length > 0 && !this.animating) {
      this.animating = true;
      this.animationId = Date.now();
      func();
    }
    return this.animationId;
  }

  /**
   * @param {func | Function}
   * The func you get the fps and do something.
   *
   * eg.
   * stage.fpsOn(function(fps) {
   *   console.log(fps);
   * });
   */
  fpsOn(func) {
    this.fpsFunc = func;
    this.fpsCacheTime = Date.now();
  }

  // fps off
  fpsOff() {
    this.fpsFunc = null;
    this.fps = 0;
  }

  // add an animation to animationList.
  animate(func) {
    this._event.triggerEvents();
    this.animationList.push(func);
    this.tick();
  }

  // clear all animations, includes global animation and shape animations.
  clearAnimation() {
    this.animationList = [];
    this.animating = false;
    cancelAnimationFrame(this[this.animationId]);
  }

  // get current version
  getVersion() {
    return this.version;
  }

  // global mousedown event.
  mousedown(func) {
    this.globalMousedown = func;
  }

  // global mousemove event
  mousemove(func) {
    this.globalMousemove = func;
  }

  /**
   *
   * @param {Object} opt
   *
   * @param {Function} opt.width  - width after resize
   * @param {Function} opt.height - height after resize
   * @param {Function} opt.resize - callback triggered after resize
   */
  resize(opt) {
    const update = () => {
      this.width = opt.width();
      this.height = opt.height();
      autoscale([this.element], {
        width: this.width,
        height: this.height
      });
    };
    if(!window.onresize) {
      window.onresize = () => {
        opt.resize && opt.resize(update);
      };
    }
  }

}
