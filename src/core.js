/* @flow */

import './utils/polyfill';
import { version } from '../package.json';
import event from './event/index';
import { Color } from './utils/color';
import { ImageLoader } from './utils/imageLoader';
import { Tween } from './tween/index';
import autoscale from './utils/autoscale';
import * as utils from './utils/helpers';
import shapes from './shapes/index';
import group from './group/index';
import clip from './clip/index';
import * as ext from './extend/export';

export type configSettings = {
  deviceScale: ?number,
  minDeviceScale: ?number,
  maxDeviceScale: ?number,
  prepareImage: boolean | Function | void,
  element: HTMLCanvasElement,
  width: number,
  height: number,
  position: ?string,
  enableGlobalTranslate: ?boolean,
  enableGlobalScale: ?boolean,
  images: ?Array<string>
}

export class OMG {

  version: string;                       // OMG's current version
  isMobile: boolean;                     // Current device is mobile phone
  objects: Array<GraghShape>;            // All shapes list
  _objects: Array<GraghShape>;           // All shapes list's reverse list
  groupRecords: number;                  // For generating and recording the graphs' zindex in a group
  transX: number;                        // The number of global translate x
  transY: number;                        // The number of global translate y
  deviceScale: number;                   // Default scale rate
  minDeviceScale: number;                // Minimum scale rate
  maxDeviceScale: number;                // Maximum scale rate
  scale: number;                         // Current scale rate
  loader: Object;                        // Instance of imageLoader
  // Ture or a function can be define. Before render, will load images first.
  // If prepareImage is a function, will trigger after images loaded.
  prepareImage: boolean | Function | void;
  globalMousedown: Function | void;      // Global mousedown function.
  globalMousemove: Function | void;      // Global mousemove function.
  Tween: any;                            // Class Tween
  animationList: Array<any>;             // The List contains page's all animation instance.
  animating: boolean | void;             // Whether the page is animating
  animationId: number | void;            // Animation's id.
  cacheIdPool: Object;                   // An object contains animationId
  fpsFunc: Function | void;              // If define fpsFunc, can get real-time fps.
  fps: number;                           // Real-time fps.
  fpsCacheTime: number;                  // Used to cache timestamps which used to calculate fps.
  eventTypes: Array<string>;             // All supported event types list.
  mobileEventTypes: Array<string>;       // All supported mobile event types list.
  _event: Object;                        // Instance of class event.
  color: Color;                          // Class color.
  element: HTMLCanvasElement;            // Element canvas.
  canvas: CanvasRenderingContext2D;      // canvas.getContext2D()
  width: number;                         // canvas's with
  height: number;                        // canvas's height
  ext: Object;                           // Export functions for extends custom graphs.
  clip: Function;                        // Export clip function.
  enableGlobalScale: boolean | void;     // Enable global translate?
  enableGlobalTranslate: boolean | void; // Enable global scale?
  images: Array<string>;                 // The image list for preload.
  utils: Object;                         // Some helper functions
  shapes: Object;                        // All shapes function.
  // shapes
  group: Function;                        // Group instance
  graphs: {[graph_name: string]: Object}; // graphs contains all graphs' instance.

  constructor(config: configSettings) {

    this.version = version;

    this.isMobile = utils.isMobile();

    this.objects = [];

    this.groupRecords = 0,

    this.transX = 0;

    this.transY = 0;

    this.deviceScale = config.deviceScale || 1;

    this.minDeviceScale = config.minDeviceScale || 0.5 * this.deviceScale;

    this.maxDeviceScale = config.maxDeviceScale || 4 * this.deviceScale;

    this.scale = this.deviceScale;

    this.loader = new ImageLoader();

    this.prepareImage = config.prepareImage;

    this.globalMousedown = void(0);

    this.globalMousemove = void(0);

    this.Tween = Tween;

    this.animationList = [];

    this.animationId = 0;

    this.animating = false;

    this.cacheIdPool = {};

    this.fpsFunc = void(0);

    this.fps = 0;

    this.fpsCacheTime = 0;

    this.graphs = {};

    this.eventTypes = [
      'click',
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

    this.mobileEventTypes = [
      'touchstart',
      'touchend',
      'touchmove',
      'tap',
      'pinch',
      'spread',
      'drag',
      'dragend',
      'dragin',
      'dragout',
      'drop'
    ];

    this._event = event(this, this.isMobile);

    this.color = new Color();

    this.element = config.element;

    this.canvas =  this.element.getContext('2d');

    this.width = config.width;

    this.height = config.height;

    autoscale([this.element], {
      width: this.width,
      height: this.height,
      position: config.position || 'relative'
    });

    /**
     * @description: For extend shapes.
     *               Export functions to define scale and drag events...
     */
    this.ext = ext;

    this.clip = clip;

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
    for(let shape in this.shapes) {
      this.graphs[shape] = settings => {
        return this.shapes[shape](settings, this);
      };
    }

    this.group = function(settings) {
      return group(settings, this);
    };
  }

  reset() {
    this.transX = 0;
    this.transY = 0;
    this.scale = this.deviceScale;
    this.objects.filter(o => !o.parent).forEach(o => {
      o.moveX = 0;
      o.moveY = 0;
    });
    this.objects.filter(o => o.type === 'group').forEach(o => {
      o.updateAllChildsPosition();
    });
    this._objects = utils.reverse(this.objects);
    this.redraw();
  }

  extend(ext: Object): void {
    for (let key in ext) {
      this.shapes[key] = ext[key];
    }
  }

  // Confused flow.
  setGlobalProps(props: {[prop_name: string]: any}) {
    for(let key in props) {
      switch(key) {
        case 'enableGlobalTranslate':
          this.enableGlobalTranslate = props[key];
          break;
        case 'enableGlobalScale':
          this.enableGlobalScale = props[key];
          break;
        default:
          break;
      }
    }
    this._event.triggerEvents();
  }

  // Array<Object> | Object
  addChild(child: any) {
    // multi or single
    if(utils.isArr(child)) {
      this.objects = this.objects.concat(child);
    } else if(utils.isObj(child)) {
      this.objects.push(child);
    }
    this.objects.sort((a, b) => {
      return a.zindex - b.zindex;
    });
    // copy the reverse events array
    this._objects = utils.reverse(this.objects);
  }

  removeChild(child: Array<Object> | Object) {
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

  imgReady() {
    this.loader.addImg(this.images);
  }

  show() {
    const _this = this;
    // dirty, ready to remove
    if(this.prepareImage) {
      this.imgReady();
      this.loader.ready(() => {
        typeof this.prepareImage === 'function' && this.prepareImage();
        _this.draw();
        _this._event.triggerEvents();
      });
    } else {
      this.draw();
      this._event.triggerEvents();
    }
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
          this.fpsFunc && this.fpsFunc(this.fps);
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
        this.finishAnimation();
        cancelAnimationFrame(this.cacheIdPool[this.animationId]);
      } else {
        this.cacheIdPool[this.animationId] = requestAnimationFrame(func);
      }
    };
    if(this.animationList.length > 0 && !this.animating) {
      this.animating = true;
      this.animationId = Date.now();
      func();
    }
    return this.animationId;
  }

  finishAnimation() {}

  /**
   * @param {func | Function}
   * The func you get the fps and do something.
   *
   * eg.
   * stage.fpsOn(function(fps) {
   *   console.log(fps);
   * });
   */
  fpsOn(func: Function) {
    this.fpsFunc = func;
    this.fpsCacheTime = Date.now();
  }

  fpsOff() {
    this.fpsFunc = void(0);
    this.fps = 0;
  }

  // add an animation to animationList.
  animate(func: Function) {
    this._event.triggerEvents();
    this.animationList.push(func);
    this.tick();
  }

  // clear all animations, includes global animation and shape animations.
  clearAnimation() {
    this.animationList = [];
    this.animating = false;
    cancelAnimationFrame(this.cacheIdPool[this.animationId]);
  }

  // get current version
  getVersion() {
    return this.version;
  }

  // global mousedown event.
  mousedown(func: Function) {
    this.globalMousedown = func;
  }

  // global mousemove event
  mousemove(func: Function) {
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
  resize(opt: {
    width: () => number,
    height: () => number,
    resize: Function
  }) {
    const update = () => {
      this.width = opt.width();
      this.height = opt.height();
      autoscale([this.element], {
        width: this.width,
        height: this.height,
        position: 'absolute'
      });
      this.redraw();
    };
    if(!window.onresize) {
      utils.bind(window, 'resize', () => {
        if(opt.resize) {
          opt.resize(update);
        } else {
          update();
        }
      });
    }
  }

}
