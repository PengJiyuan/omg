/*!
 * omg.js v4.0.0
 * Author: PengJiyuan
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.omg = factory());
}(this, (function () { 'use strict';

/* eslint-disable */

// requestAnimationFrame polyfill
(function () {
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  var lastTime = 0;
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }

  // Object.assign polyfill
  if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) {
        // .length of function is 2
        'use strict';

        if (target == null) {
          // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource != null) {
            // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }
})();

var version = "4.0.0";

function getPos(e, element, touchend) {
  var ev = e || window.event;
  var ele = element || ev.target;
  var boundingRect = ele.getBoundingClientRect();

  var x = void 0,
      y = void 0;
  var touchList = touchend ? ev.changedTouches : ev.touches;
  if (isMobile()) {
    x = touchList[0].clientX - boundingRect.left;
    y = touchList[0].clientY - boundingRect.top;
  } else {
    x = ev.offsetX || ev.clientX;
    y = ev.offsetY || ev.clientY;
  }
  return { x: x, y: y };
}

function bind(target, eventType, handler) {
  if (window.addEventListener) {
    target.addEventListener(eventType, handler, false);
  } else if (target.attachEvent) {
    target.attachEvent('on' + eventType, handler);
  }
  return target;
}

function unbind(target, eventType, handler) {
  if (window.removeEventListener) {
    target.removeEventListener(eventType, handler, false);
  } else if (window.detachEvent) {
    target.detachEvent && target.detachEvent(eventType, handler);
  }
}

// do not change the origin array
function reverse(array) {
  var _ref = [array.length, []],
      length = _ref[0],
      ret = _ref[1];

  for (var i = 0; i < length; i++) {
    ret[i] = array[length - i - 1];
  }
  return ret;
}

function formatFloat(f) {
  var m = Math.pow(10, 10);
  return parseInt(f * m, 10) / m;
}

function getMax(arr) {
  return Math.max.apply(null, arr);
}

function getMin(arr) {
  return Math.min.apply(null, arr);
}

function insertArray(originArray, start, number, insertArray) {
  var args = [start, number].concat(insertArray);
  Array.prototype.splice.apply(originArray, args);
}

function isArr(obj) {
  return !!(Object.prototype.toString.call(obj) === '[object Array]');
}

function isObj(obj) {
  return !!(Object.prototype.toString.call(obj) === '[object Object]');
}

function isMobile() {
  return (/(iphone|ipad|ipod|ios|android|mobile|blackberry|iemobile|mqqbrowser|juc|fennec|wosbrowser|browserng|Webos|symbian|windows phone)/i.test(navigator.userAgent)
  );
}

var utils = Object.freeze({
	getPos: getPos,
	bind: bind,
	unbind: unbind,
	reverse: reverse,
	formatFloat: formatFloat,
	getMax: getMax,
	getMin: getMin,
	insertArray: insertArray,
	isArr: isArr,
	isObj: isObj,
	isMobile: isMobile
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Event = function () {
  function Event(_this) {
    var _this2 = this;

    classCallCheck(this, Event);

    this.mouseWheel = function (e) {
      e.preventDefault();
      if (e.deltaY && e.deltaY > 0) {
        _this2._.scale = _this2._.scale - 0.01 >= _this2._.minDeviceScale ? _this2._.scale - 0.01 : _this2._.minDeviceScale;
      } else if (e.deltaY && e.deltaY < 0) {
        _this2._.scale = _this2._.scale + 0.01 <= _this2._.maxDeviceScale ? _this2._.scale + 0.01 : _this2._.maxDeviceScale;
      }
      _this2._.redraw();
    };

    // global this
    this._ = _this;
    this.triggeredMouseDown = false;
    this.triggeredMouseMove = false;
  }

  createClass(Event, [{
    key: 'getPos',
    value: function getPos$$1(e) {
      return getPos(e, this._.element);
    }
  }, {
    key: 'triggerEvents',
    value: function triggerEvents() {
      var _this3 = this;

      var hasEvents = this._.objects.filter(function (item) {
        return !item.hide;
      }).some(function (item) {
        return item.events && isArr(item.events) || item.enableDrag;
      });
      if (!hasEvents && !this._.enableGlobalTranslate && !this._.enableGlobalScale) {
        return;
      }

      var hasEnterOrMove = this._.objects.some(function (item) {
        return item.events && item.events.some(function (i) {
          return ~_this3._.eventTypes.indexOf(i.eventType);
        });
      }) || this._.globalMousemove;

      // mouseenter mousemove
      if (hasEnterOrMove && !this.triggeredMouseMove) {
        this.bindMouseMove();
        this.triggeredMouseMove = true;
      }

      if (!hasEnterOrMove && this.triggeredMouseMove) {
        this.unBindMouseMove();
        this.triggeredMouseMove = false;
      }

      if (!this.triggeredMouseDown) {
        bind(this._.element, 'mousedown', this.mouseDown.bind(this));
        this.triggeredMouseDown = true;
      }

      if (this._.enableGlobalScale) {
        this.bindMouseWheel();
      } else {
        this.unBindMouseWheel();
      }
    }
  }, {
    key: 'bindMouseWheel',
    value: function bindMouseWheel() {
      bind(this._.element, 'wheel', this.mouseWheel);
    }
  }, {
    key: 'unBindMouseWheel',
    value: function unBindMouseWheel() {
      unbind(this._.element, 'wheel', this.mouseWheel);
    }
  }, {
    key: 'bindMouseMove',
    value: function bindMouseMove() {
      bind(this._.element, 'mousemove', this.mouseEnterOrMove.bind(this));
    }
  }, {
    key: 'unBindMouseMove',
    value: function unBindMouseMove() {
      unbind(this._.element, 'mousemove', this.mouseEnterOrMove.bind(this));
    }
  }, {
    key: 'mouseEnterOrMove',
    value: function mouseEnterOrMove(e_moveOrEnter) {
      var that = this;
      var isDragging = void 0;

      var mX = that.getPos(e_moveOrEnter).x;
      var mY = that.getPos(e_moveOrEnter).y;

      that._.globalMousemove && that._.globalMousemove(e_moveOrEnter);

      isDragging = that._.objects.some(function (item) {
        return item.isDragging;
      });

      // trigger mouseenter and mousemove
      var movedOn = that._._objects.filter(function (item) {
        return item.isPointInner(mX, mY) && !item.hide;
      });

      if (isDragging) {
        // dragin
        if (movedOn && movedOn.length > 1) {
          movedOn[1].events && movedOn[1].events.forEach(function (i) {
            if (i.eventType === 'dragin' && !movedOn[1].hasDraggedIn) {
              movedOn[1].hasDraggedIn = true;
              i.callback && i.callback(movedOn[1]);
            }
          });
        }

        // dragout handler
        var handleDragOut = function handleDragOut(item) {
          item.hasDraggedIn && item.events.forEach(function (i) {
            if (i.eventType === 'dragout') {
              i.callback && i.callback(movedOn[1]);
            }
          });
          item.hasDraggedIn = false;
        };

        // Determine whether the mouse is dragged out from the shape and trigger dragout handler
        that._._objects.some(function (item) {
          return item.hasDraggedIn && (!item.isPointInner(mX, mY) || movedOn[1] !== item) && handleDragOut(item);
        });
      } else {
        // mouseleave handler
        var handleMoveOut = function handleMoveOut(item) {
          item.hasEnter && item.events.forEach(function (i) {
            if (i.eventType === 'mouseleave') {
              i.callback && i.callback(item);
            }
          });
          item.hasEnter = false;
        };
        // normal mousemove
        // Determine whether the mouse is removed from the shape and trigger mouseleave handler
        that._._objects.some(function (item) {
          return item.hasEnter && (!item.isPointInner(mX, mY) || movedOn[0] !== item) && handleMoveOut(item);
        });
        if (movedOn && movedOn.length > 0) {
          movedOn[0].events && movedOn[0].events.forEach(function (i) {
            if (i.eventType === 'mouseenter' && !movedOn[0].hasEnter) {
              movedOn[0].hasEnter = true;
              i.callback && i.callback(movedOn[0]);
            } else if (i.eventType === 'mousemove') {
              i.callback && i.callback(movedOn[0]);
            }
          });
        }
      }
    }
  }, {
    key: 'mouseDown',
    value: function mouseDown(e_down) {
      var that = this,
          whichIn = void 0,
          hasEventDrag = void 0,
          hasEventDragEnd = void 0,
          dragCb = void 0,
          dragEndCb = void 0;

      // global setting event mousedown
      this._.globalMousedown && this._.globalMousedown(e_down);

      var hasDrags = this._.objects.filter(function (item) {
        return !item.hide;
      }).some(function (item) {
        return item.enableDrag && !item.fixed;
      });

      // drag shape
      var pX = this.getPos(e_down).x;
      var pY = this.getPos(e_down).y;
      that.cacheX = pX;
      that.cacheY = pY;

      // mousedown
      var whichDown = this._._objects.filter(function (item) {
        return item.isPointInner(pX, pY) && !item.hide;
      });

      if (whichDown && whichDown.length > 0) {
        if (whichDown[0].enableChangeIndex) {
          that.changeOrder(whichDown[0]);
        }
        whichDown[0].events && whichDown[0].events.some(function (i) {
          return i.eventType === 'mousedown' && i.callback && i.callback(whichDown[0]);
        });
      }

      // mouseDrag
      if (hasDrags) {
        whichIn = that._._objects.filter(function (item) {
          return !item.hide;
        }).filter(function (item) {
          return item.isPointInner(pX, pY) && !item.fixed;
        });

        hasEventDrag = whichIn.length > 0 && whichIn[0].events && whichIn[0].events.some(function (item) {
          if (item.eventType === 'drag') {
            dragCb = item.callback;
          }
          return item.eventType === 'drag';
        });

        hasEventDragEnd = whichIn.length > 0 && whichIn[0].events && whichIn[0].events.some(function (item) {
          if (item.eventType === 'dragend') {
            dragEndCb = item.callback;
          }
          return item.eventType === 'dragend';
        });

        var move_Event = function move_Event(e_move) {
          var mx = that.getPos(e_move).x;
          var my = that.getPos(e_move).y;

          whichIn[0].moveX = whichIn[0].moveX + mx - that.cacheX;
          whichIn[0].moveY = whichIn[0].moveY + my - that.cacheY;

          // event drag
          hasEventDrag && dragCb(whichDown[0]);

          that._.redraw();
          that.cacheX = mx;
          that.cacheY = my;
          whichIn[0].isDragging = true;
        };

        var up_Event = function up_Event(e_up) {
          var uX = that.getPos(e_up).x;
          var uY = that.getPos(e_up).y;

          var upOn = that._._objects.filter(function (item) {
            return item.isPointInner(uX, uY);
          });

          if (upOn && upOn.length > 1) {
            if (upOn[1].hasDraggedIn) {
              upOn[1].hasDraggedIn = false;
              var dp = upOn[1].events.some(function (i) {
                return i.eventType === 'drop' && i.callback && i.callback(upOn[1], upOn[0]);
              });
              // if not defined event drop, check if event dragout exist
              // if yes, trigger the callback dragout.
              !dp && upOn[1].events.some(function (i) {
                return i.eventType === 'dragout' && i.callback && i.callback(upOn[1]);
              });
            }
          }

          // event dragend
          hasEventDragEnd && dragEndCb(whichDown[0]);

          unbind(document, 'mousemove', move_Event);
          unbind(document, 'mouseup', up_Event);
          whichIn[0].isDragging = false;
        };
        if (whichIn && whichIn.length > 0 && whichIn[0].enableDrag) {
          bind(document, 'mousemove', move_Event);
          bind(document, 'mouseup', up_Event);
        }
      }

      // global translate
      if (this._.enableGlobalTranslate && !(whichIn && whichIn.length > 0)) {

        var move_dragCanvas = function move_dragCanvas(e_move) {
          var mx = that.getPos(e_move).x;
          var my = that.getPos(e_move).y;
          // that._.originTransX = that._.originTransX + mx - that.cacheX;
          // that._.originTransY = that._.originTransY  + my - that.cacheY;
          that._.transX = that._.transX + mx - that.cacheX;
          that._.transY = that._.transY + my - that.cacheY;
          that._.redraw();
          that.cacheX = mx;
          that.cacheY = my;
        };

        var up_dragCanvas = function up_dragCanvas() {
          unbind(document, 'mousemove', move_dragCanvas);
          unbind(document, 'mouseup', up_dragCanvas);
        };

        bind(document, 'mousemove', move_dragCanvas);
        bind(document, 'mouseup', up_dragCanvas);
      }
    }
  }, {
    key: 'changeOrder',
    value: function changeOrder(item) {
      var i = this._.objects.indexOf(item);
      var cacheData = this._.objects[i];
      this._.objects.splice(i, 1);
      this._.objects.push(cacheData);
      this._._objects = reverse(this._.objects);
      this._.redraw();
    }
  }]);
  return Event;
}();

var MobileEvent = function () {
  function MobileEvent(_this) {
    classCallCheck(this, MobileEvent);

    // global this
    this._ = _this;
  }

  createClass(MobileEvent, [{
    key: 'getPos',
    value: function getPos$$1(e, touchend) {
      return getPos(e, this._.element, touchend);
    }
  }, {
    key: 'triggerEvents',
    value: function triggerEvents() {
      var hasEvents = this._.objects.filter(function (item) {
        return !item.hide;
      }).some(function (item) {
        return item.events && isArr(item.events) || item.enableDrag;
      });
      if (!hasEvents && !this._.enableGlobalTranslate && !this._.enableGlobalScale) {
        return;
      }

      if (!this.triggeredTouchStart) {
        bind(this._.element, 'touchstart', this.touchStart.bind(this));
        this.triggeredTouchStart = true;
      }
    }
  }, {
    key: 'touchStart',
    value: function touchStart(e_start) {
      e_start.preventDefault();
      // 两指操控
      // if(e_start.touches.length > 1) {
      //   alert(e_start.touches);
      //   return;
      // }
      var that = this,
          whichIn = void 0,
          hasEventDrag = void 0,
          dragCb = void 0;

      // drag shape
      var pos = this.getPos(e_start);
      var _ref = [pos.x, pos.y],
          pX = _ref[0],
          pY = _ref[1];

      that.cacheX = pX;
      that.cacheY = pY;

      // which shape is touched
      var whichDown = this._._objects.filter(function (item) {
        return item.isPointInner(pX, pY) && !item.hide;
      });

      if (whichDown && whichDown.length > 0) {
        if (whichDown[0].enableChangeIndex) {
          that.changeOrder(whichDown[0]);
        }
        whichDown[0].events && whichDown[0].events.some(function (i) {
          return i.eventType === 'touchstart' && i.callback && i.callback(whichDown[0]);
        });
      }

      var hasDrags = this._.objects.filter(function (item) {
        return !item.hide;
      }).some(function (item) {
        return item.enableDrag && !item.fixed;
      });

      // drag
      if (hasDrags) {
        whichIn = that._._objects.filter(function (item) {
          return !item.hide;
        }).filter(function (item) {
          return item.isPointInner(pX, pY) && !item.fixed;
        });

        hasEventDrag = whichIn.length > 0 && whichIn[0].events && whichIn[0].events.some(function (item) {
          if (item.eventType === 'drag') {
            dragCb = item.callback;
          }
          return item.eventType === 'drag';
        });

        var move_Event = function move_Event(e_move) {
          var pos = that.getPos(e_move);
          var _ref2 = [pos.x, pos.y],
              mx = _ref2[0],
              my = _ref2[1];


          whichIn[0].moveX = whichIn[0].moveX + mx - that.cacheX;
          whichIn[0].moveY = whichIn[0].moveY + my - that.cacheY;

          // event drag
          hasEventDrag && dragCb(whichDown[0]);

          that._.redraw();
          that.cacheX = mx;
          that.cacheY = my;
          whichIn[0].isDragging = true;
        };

        var up_Event = function up_Event() /* e_up */{
          // const pos = that.getPos(e_up, true);
          // const [ uX, uY ] = [ pos.x, pos.y ];

          // touchend
          whichIn[0].events && whichIn[0].events.some(function (i) {
            return i.eventType === 'touchend' && i.callback && i.callback(whichIn[0]);
          });

          unbind(document, 'touchmove', move_Event);
          unbind(document, 'touchend', up_Event);
          whichIn[0].isDragging = false;
        };
        if (whichIn && whichIn.length > 0 && whichIn[0].enableDrag) {
          bind(document, 'touchmove', move_Event);
          bind(document, 'touchend', up_Event);
        }
      }
    }
  }, {
    key: 'changeOrder',
    value: function changeOrder(item) {
      var i = this._.objects.indexOf(item);
      var cacheData = this._.objects[i];
      this._.objects.splice(i, 1);
      this._.objects.push(cacheData);
      this._._objects = reverse(this._.objects);
      this._.redraw();
    }
  }]);
  return MobileEvent;
}();

function event(_this, isMobile) {
  return isMobile ? new MobileEvent(_this) : new Event(_this);
}

var Color = function () {
  function Color() {
    classCallCheck(this, Color);
  }

  createClass(Color, [{
    key: 'hexToRGB',


    // converts hex to RGB
    value: function hexToRGB(hex) {
      var rgb = [];

      hex = hex.substr(1);

      // converts #abc to #aabbcc
      if (hex.length === 3) {
        hex = hex.replace(/(.)/g, '$1$1');
      }

      hex.replace(/../g, function (color) {
        rgb.push(parseInt(color, 0x10));
        return color;
      });

      return {
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
        rgb: 'rgb(' + rgb.join(',') + ')'
      };
    }

    // converts rgb to HSL

  }, {
    key: 'rgbToHSL',
    value: function rgbToHSL(r, g, b) {
      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b),
          min = Math.min(r, g, b);
      var h = 0,
          s = void 0,
          l = (max + min) / 2;

      if (max == min) {
        h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return {
        h: h,
        s: s,
        l: l,
        hsl: 'hsl(' + h * 360 + ', ' + s * 100 + '%, ' + l * 100 + '%)'
      };
    }

    // converts hsl to RGB
    // hslToRGB() {
    // }

    // color lighten

  }, {
    key: 'lighten',
    value: function lighten(color, percent) {
      var hsl = void 0,
          h = void 0,
          s = void 0,
          l = void 0,
          rgba = void 0,
          a = void 0;
      if (!color || !percent || !/^[0-9]{1,2}%$/.test(percent)) {
        return;
      }
      if (this.isRgba(color)) {
        rgba = this.getRgba(color);
        a = +rgba.a - Number(percent.slice(0, -1)) / 100;
        return 'rgba(' + rgba.r + ', ' + rgba.g + ', ' + rgba.b + ', ' + a + ')';
      } else {
        hsl = this.getHsl(color);
        h = +hsl.h;
        s = +hsl.s;
        l = +hsl.l * 100 + +percent.slice(0, -1);

        return 'hsl(' + h * 360 + ', ' + s * 100 + '%, ' + l + '%)';
      }
    }

    // color darken

  }, {
    key: 'darken',
    value: function darken(color, percent) {
      var hsl = void 0,
          h = void 0,
          s = void 0,
          l = void 0,
          rgba = void 0,
          a = void 0;
      if (!color || !percent || !/^[0-9]{1,2}%$/.test(percent)) {
        return;
      }
      if (this.isRgba(color)) {
        rgba = this.getRgba(color);
        a = +rgba.a + Number(percent.slice(0, -1)) / 100;
        return 'rgba(' + rgba.r + ', ' + rgba.g + ', ' + rgba.b + ', ' + a + ')';
      } else {
        hsl = this.getHsl(color);
        h = +hsl.h;
        s = +hsl.s;
        l = +hsl.l * 100 - +percent.slice(0, -1);

        return 'hsl(' + h * 360 + ', ' + s * 100 + '%, ' + l + '%)';
      }
    }
  }, {
    key: 'isHex',
    value: function isHex(color) {
      return !!/^#[a-fA-F0-9]{3}$|#[a-fA-F0-9]{6}$/.test(color);
    }
  }, {
    key: 'isRgb',
    value: function isRgb(color) {
      return !!/^rgb\((\s*[0-5]{0,3}\s*,?){3}\)$/.test(color);
    }
  }, {
    key: 'isRgba',
    value: function isRgba(color) {
      return !!/^rgba\((\s*[0-5]{0,3}\s*,?){3}[0-9.\s]*\)$/.test(color);
    }
  }, {
    key: 'getRgb',
    value: function getRgb(color) {
      var rgb = void 0,
          r = void 0,
          g = void 0,
          b = void 0;
      if (this.isHex(color)) {
        rgb = this.hexToRGB(color);
        var _ref = [rgb.r, rgb.g, rgb.b];
        r = _ref[0];
        g = _ref[1];
        b = _ref[2];
      } else if (this.isRgb(color)) {
        rgb = color.slice(4, -1).split(',');
        var _ref2 = [rgb[0], rgb[1], rgb[2]];
        r = _ref2[0];
        g = _ref2[1];
        b = _ref2[2];
      }
      return { r: r, g: g, b: b };
    }
  }, {
    key: 'getRgba',
    value: function getRgba(color) {
      var rgba = void 0,
          r = void 0,
          g = void 0,
          b = void 0,
          a = void 0;
      rgba = color.slice(5, -1).split(',');
      var _ref3 = [rgba[0], rgba[1], rgba[2], rgba[3]];
      r = _ref3[0];
      g = _ref3[1];
      b = _ref3[2];
      a = _ref3[3];


      return { r: r, g: g, b: b, a: a };
    }
  }, {
    key: 'getHsl',
    value: function getHsl(color) {
      var hsl = void 0,
          rgb = void 0,
          r = void 0,
          g = void 0,
          b = void 0,
          h = void 0,
          s = void 0,
          l = void 0;
      rgb = this.getRgb(color);
      var _ref4 = [rgb.r, rgb.g, rgb.b];
      r = _ref4[0];
      g = _ref4[1];
      b = _ref4[2];


      hsl = this.rgbToHSL(r, g, b);
      var _ref5 = [hsl.h, hsl.s, hsl.l];
      h = _ref5[0];
      s = _ref5[1];
      l = _ref5[2];


      return { h: h, s: s, l: l };
    }
  }]);
  return Color;
}();

var ImageLoader = function () {
  function ImageLoader() {
    classCallCheck(this, ImageLoader);

    this.imageList = [];
    this.loadNum = 0;
  }

  createClass(ImageLoader, [{
    key: "ready",
    value: function ready(callback) {
      var _this = this;

      this.imageList.forEach(function (img) {
        _this.loadImg(img);
      });
      var timer = setInterval(function () {
        if (_this.loadNum === _this.imageList.length) {
          clearInterval(timer);
          callback && callback();
        }
      }, 50);
    }
  }, {
    key: "loadImg",
    value: function loadImg(img) {
      var _this2 = this;

      var timer = setInterval(function () {
        if (img.complete === true) {
          _this2.loadNum++;
          clearInterval(timer);
        }
      }, 50);
    }
  }, {
    key: "addImg",
    value: function addImg(imageArray) {
      var _this3 = this;

      imageArray.forEach(function (src) {
        var img = new Image();
        img.src = src;
        img.id = src;
        _this3.imageList.push(img);
      });
    }
  }, {
    key: "getImg",
    value: function getImg(name) {
      var target = void 0;
      this.imageList.forEach(function (img) {
        if (img.id == name) {
          target = img;
        }
      });
      return target;
    }
  }]);
  return ImageLoader;
}();

/**!
 * code from https://github.com/LiikeJS/Liike/blob/master/src/ease.js
 */
var easeInBy = function easeInBy(power) {
  return function (t) {
    return Math.pow(t, power);
  };
};
var easeOutBy = function easeOutBy(power) {
  return function (t) {
    return 1 - Math.abs(Math.pow(t - 1, power));
  };
};
var easeInOutBy = function easeInOutBy(power) {
  return function (t) {
    return t < 0.5 ? easeInBy(power)(t * 2) / 2 : easeOutBy(power)(t * 2 - 1) / 2 + 0.5;
  };
};

var linear = function linear(t) {
  return t;
};
var quadIn = easeInBy(2);
var quadOut = easeOutBy(2);
var quadInOut = easeInOutBy(2);
var cubicIn = easeInBy(3);
var cubicOut = easeOutBy(3);
var cubicInOut = easeInOutBy(3);
var quartIn = easeInBy(4);
var quartOut = easeOutBy(4);
var quartInOut = easeInOutBy(4);
var quintIn = easeInBy(5);
var quintOut = easeOutBy(5);
var quintInOut = easeInOutBy(5);
var sineIn = function sineIn(t) {
  return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2);
};
var sineOut = function sineOut(t) {
  return Math.sin(Math.PI / 2 * t);
};
var sineInOut = function sineInOut(t) {
  return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
};
var bounceOut = function bounceOut(t) {
  var s = 7.5625;
  var p = 2.75;

  if (t < 1 / p) {
    return s * t * t;
  }
  if (t < 2 / p) {
    t -= 1.5 / p;
    return s * t * t + 0.75;
  }
  if (t < 2.5 / p) {
    t -= 2.25 / p;
    return s * t * t + 0.9375;
  }
  t -= 2.625 / p;
  return s * t * t + 0.984375;
};
var bounceIn = function bounceIn(t) {
  return 1 - bounceOut(1 - t);
};
var bounceInOut = function bounceInOut(t) {
  return t < 0.5 ? bounceIn(t * 2) * 0.5 : bounceOut(t * 2 - 1) * 0.5 + 0.5;
};

var easing = Object.freeze({
	linear: linear,
	quadIn: quadIn,
	quadOut: quadOut,
	quadInOut: quadInOut,
	cubicIn: cubicIn,
	cubicOut: cubicOut,
	cubicInOut: cubicInOut,
	quartIn: quartIn,
	quartOut: quartOut,
	quartInOut: quartInOut,
	quintIn: quintIn,
	quintOut: quintOut,
	quintInOut: quintInOut,
	sineIn: sineIn,
	sineOut: sineOut,
	sineInOut: sineInOut,
	bounceOut: bounceOut,
	bounceIn: bounceIn,
	bounceInOut: bounceInOut
});

var Tween = function () {
  function Tween(settings) {
    classCallCheck(this, Tween);
    var from = settings.from,
        to = settings.to,
        duration = settings.duration,
        delay = settings.delay,
        easing = settings.easing,
        onStart = settings.onStart,
        onUpdate = settings.onUpdate,
        onFinish = settings.onFinish;


    for (var key in from) {
      if (to[key] === undefined) {
        to[key] = from[key];
      }
    }
    for (var _key in to) {
      if (from[_key] === undefined) {
        from[_key] = to[_key];
      }
    }

    this.from = from;
    this.to = to;
    this.duration = duration || 500;
    this.delay = delay || 0;
    this.easing = easing || 'linear';
    this.onStart = onStart;
    this.onUpdate = onUpdate;
    this.onFinish = onFinish;
    this.startTime = Date.now() + this.delay;
    this.started = false;
    this.finished = false;
    this.keys = {};
  }

  createClass(Tween, [{
    key: 'update',
    value: function update() {
      this.time = Date.now();
      // delay some time
      if (this.time < this.startTime) {
        return;
      }
      // finish animation
      if (this.elapsed === this.duration) {
        if (!this.finished) {
          this.finished = true;
          this.onFinish && this.onFinish(this.keys);
        }
        return;
      }
      this.elapsed = this.time - this.startTime;
      this.elapsed = this.elapsed > this.duration ? this.duration : this.elapsed;
      for (var key in this.to) {
        this.keys[key] = this.from[key] + (this.to[key] - this.from[key]) * easing[this.easing](this.elapsed / this.duration);
      }
      if (!this.started) {
        this.onStart && this.onStart(this.keys);
        this.started = true;
      }
      this.onUpdate(this.keys);
    }
  }]);
  return Tween;
}();

// https://github.com/component/autoscale-canvas/blob/master/index.js

/**
 * Retina-enable the given `canvas`.
 *
 * @param {Canvas} canvas
 * @return {Canvas}
 * @api public
 */

var autoscale = (function (canvasList, opt) {
  var ratio = window.devicePixelRatio || 1,
      ctx = null;

  canvasList.forEach(function (canvas) {
    ctx = canvas.getContext('2d');
    canvas.style.position = opt.position;
    canvas.style.width = opt.width + 'px';
    canvas.style.height = opt.height + 'px';
    canvas.width = opt.width * ratio;
    canvas.height = opt.height * ratio;
    ctx.scale(ratio, ratio);
  });

  return canvasList;
});

var insideRectangle = (function (x, y, recX, recY, recW, recH) {
  var xRight = x > recX;
  var xLeft = x < recX + recW;
  var yTop = y > recY;
  var yBottom = y < recY + recH;

  return xRight && xLeft && yTop && yBottom;
});

// https://github.com/ecomfe/zrender/blob/master/src/contain/line.js
var insideLine = (function (x0, y0, x1, y1, lineWidth, x, y) {
  if (lineWidth === 0) {
    return false;
  }
  var _l = lineWidth;
  var _a = 0;
  var _b = x0;
  // Quick reject
  if (y > y0 + _l && y > y1 + _l || y < y0 - _l && y < y1 - _l || x > x0 + _l && x > x1 + _l || x < x0 - _l && x < x1 - _l) {
    return false;
  }

  if (x0 !== x1) {
    _a = (y0 - y1) / (x0 - x1);
    _b = (x0 * y1 - x1 * y0) / (x0 - x1);
  } else {
    return Math.abs(x - x0) <= _l / 2;
  }
  var tmp = _a * x - y + _b;
  var _s = tmp * tmp / (_a * _a + 1);
  return _s <= _l / 2 * _l / 2;
});

var insideArc = (function (x, y, r, sa, ea) {
  var pi = Math.PI;
  var dis = void 0,
      isIn = void 0;
  // Sector
  if (!isNaN(sa) && !isNaN(ea)) {
    var angle = 0;
    // 4th quadrant
    if (x >= 0 && y >= 0) {
      if (x === 0) {
        angle = pi / 2;
      } else {
        angle = Math.atan(y / x);
      }
    }
    // 3th quadrant
    else if (x <= 0 && y >= 0) {
        if (x === 0) {
          angle = pi;
        } else {
          angle = pi - Math.atan(y / Math.abs(x));
        }
      }
      // secend quadrant
      else if (x <= 0 && y <= 0) {
          if (x === 0) {
            angle = pi;
          } else {
            angle = Math.atan(Math.abs(y) / Math.abs(x)) + pi;
          }
        }
        // first quadrant
        else if (x >= 0 && y <= 0) {
            if (x === 0) {
              angle = pi * 3 / 2;
            } else {
              angle = 2 * pi - Math.atan(Math.abs(y) / x);
            }
          }
    dis = Math.sqrt(x * x + y * y);
    if (sa < ea) {
      isIn = !!(angle >= sa && angle <= ea && dis <= r);
    } else {
      isIn = !!((angle >= 0 && angle <= ea || angle >= sa && angle <= 2 * pi) && dis <= r);
    }
  }
  // normal arc
  else {
      isIn = !!(Math.sqrt(x * x + y * y) <= r);
    }
  return isIn;
});

/**
 * @type: polygon
 *
 * Return true if the given point is contained inside the boundary.
 * See: http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
 * @return true if the point is inside the boundary, false otherwise
 */
var insidePolygon = (function (x, y, points) {
  var result = false;
  for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
    if (points[i][1] > y != points[j][1] > y && x < (points[j][0] - points[i][0]) * (y - points[i][1]) / (points[j][1] - points[i][1]) + points[i][0]) {
      result = !result;
    }
  }
  return result;
});

var _isPointInner = function (x, y) {
  // 图形内部偏移的像素
  var mx = this.moveX * this._.scale;
  var my = this.moveY * this._.scale;
  // 全局偏移的像素
  var ltx = this.fixed ? 0 : this._.transX;
  var lty = this.fixed ? 0 : this._.transY;
  // 鼠标获取到的坐标减去全局偏移像素和图形内部偏移的像素
  var pgx = x - mx - ltx;
  var pgy = y - my - lty;

  switch (this.type) {
    /**
     * @type: image, text, coord
     */
    case 'rectangle':
    case 'group':
      return insideRectangle(pgx, pgy, this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height);
    /**
     * @type: Arc
     */
    case 'arc':
      var cx = this.scaled_x,
          // 圆心x
      cy = this.scaled_y,
          // 圆心y
      pi = Math.PI,

      // 将度数转化为PI角度
      sa = this.startAngle < 0 ? 2 * pi + pi / 180 * this.startAngle : pi / 180 * this.startAngle,
          ea = this.endAngle < 0 ? 2 * pi + pi / 180 * this.endAngle : pi / 180 * this.endAngle,
          r = this.scaled_radius,
          dx = pgx - cx,
          dy = pgy - cy;
      return insideArc(dx, dy, r, sa, ea);
    /**
     * @type: polygon
     */
    case 'polygon':
      return insidePolygon(pgx, pgy, this.scaled_matrix);
    /**
     * @type: line
     */
    case 'line':
      var linePoints = this.scaled_matrix;
      var length = linePoints.length;
      for (var i = 0; i < length; i++) {
        if (i > 0) {
          if (insideLine(linePoints[i - 1][0], linePoints[i - 1][1], linePoints[i][0], linePoints[i][1], this.scaled_lineWidth, pgx, pgy)) {
            return true;
          }
        }
      }
      return false;
    default:
      break;
  }
};

/**
 * @param {Array}  points - point list
 * @return {Array} bounding points. left top, right top, right bottom, left bottom.
 */
function getBounding(points, lineWidth) {
  var lw = lineWidth ? lineWidth : 0;
  var xList = points.map(function (point) {
    return point[0];
  });
  var yList = points.map(function (point) {
    return point[1];
  });
  var minX = getMin(xList) - lw;
  var maxX = getMax(xList) + lw;
  var minY = getMin(yList) - lw;
  var maxY = getMax(yList) + lw;
  var lt = [minX, minY];
  var lb = [minX, maxY];
  var rt = [maxX, minY];
  var rb = [maxX, maxY];
  var w = maxX - minX;
  var h = maxY - minY;
  return {
    lt: lt,
    rt: rt,
    rb: rb,
    lb: lb,
    w: w,
    h: h
  };
}

// No flow check, because flow do not support dynamic assign value.

var Display = function () {
  function Display(settings, _this) {
    classCallCheck(this, Display);


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

  createClass(Display, [{
    key: 'on',
    value: function on(eventTypes, callback) {
      if (!eventTypes) {
        throw 'no eventTypes defined!';
      }

      if (!callback || typeof callback !== 'function') {
        throw 'you need defined a callback!';
      }

      this.events = this.events || [];

      var allSupportEventTypes = this._.eventTypes.concat(this._.mobileEventTypes);
      var eTypes = eventTypes.split(' '),
          that = this;

      eTypes.forEach(function (event) {
        if (~allSupportEventTypes.indexOf(event)) {
          that.events.push({
            eventType: event,
            callback: callback
          });
        } else {
          throw event + ' is not in eventTypes!\n Please use event in ' + allSupportEventTypes;
        }
      });

      return this;
    }

    // whether pointer is inner this shape

  }, {
    key: 'isPointInner',
    value: function isPointInner(x, y) {
      return _isPointInner.bind(this)(x, y);
    }
  }, {
    key: 'config',
    value: function config(obj) {
      if (!isObj(obj)) {
        return this;
      }
      this.enableDrag = obj.drag || this.enableDrag;
      this.enableChangeIndex = obj.changeIndex || this.enableChangeIndex;
      this.fixed = obj.fixed || this.fixed;
      this.cliping = obj.cliping || this.cliping; // Whether the graphic is animating drawn
      this.zindex = obj.zindex || this.zindex;

      return this;
    }
  }, {
    key: 'animateTo',
    value: function animateTo(keys) {
      var _this2 = this;

      var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.animating = true;
      var data = {};
      var to = keys;
      var from = {};
      for (var key in to) {
        from[key] = this[key];
      }
      data.from = from;
      data.to = to;
      data.onUpdate = function (keys) {
        for (var _key in to) {
          _this2[_key] = keys[_key];
        }
        configs.onUpdate && configs.onUpdate(keys);
      };
      for (var _key2 in configs) {
        if (_key2 !== 'onUpdate') {
          data[_key2] = configs[_key2];
        }
      }
      data.onFinish = function () {
        _this2.animating = false;
        configs.onFinish && configs.onFinish(keys);
      };
      var tween = new Tween(data);
      this._.animationList.push(tween);
      this._.tick();

      return this;
    }

    // whether this shape can be dragged

  }, {
    key: 'drag',
    value: function drag(bool) {
      this.enableDrag = bool;
    }

    // when select this shape, whether it should be changed the index

  }, {
    key: 'changeIndex',
    value: function changeIndex(bool) {
      this.enableChangeIndex = bool;
    }
  }]);
  return Display;
}();

function display(settings, _this) {
  var display = new Display(settings, _this);

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

    getBounding: function getBounding$$1() {
      return getBounding(this.scaled_matrix, this.scaled_lineWidth);
    }
  });
}

/**
 * @PengJiyuan
 *
 * Two-dimensional coordinate system
 * Matrix transformation
 */

/**
 * return 3x3 Matrix
 */
var PI = Math.PI;
var COS = Math.cos;
var SIN = Math.sin;
var ABS = Math.abs;

var createTransformMatrix = function createTransformMatrix() {
  var originMatrix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0, 0];
  var angle = arguments[1];

  var tx = originMatrix[0];
  var ty = originMatrix[1];
  var radian = -(PI / 180 * angle);

  return [[COS(radian), -SIN(radian), (1 - COS(radian)) * tx + ty * SIN(radian)], [SIN(radian), COS(radian), (1 - COS(radian)) * ty - tx * SIN(radian)], [0, 0, 1]];
};

/**
 * a, b, c     x     a*x + b*y + c*1
 * d, e, f  *  y  =  d*x + e*y + f*1
 * g, h, i     1     g*x + h*y + i*1
 */
var getTransformMatrix = function getTransformMatrix(originMatrix, matrix) {
  var angle = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  var t = createTransformMatrix(originMatrix, angle);
  var ret = [];
  matrix.forEach(function (m) {
    var pm = [m[0], m[1], 1];
    var tx = t[0][0] * pm[0] + t[0][1] * pm[1] + t[0][2] * pm[2];
    var ty = t[1][0] * pm[0] + t[1][1] * pm[1] + t[1][2] * pm[2];
    // t[2] = [0, 0, 1]; ignore.
    ret.push([ABS(tx) < 0.0000001 ? 0 : tx, ABS(ty) < 0.0000001 ? 0 : ty]);
  });
  return ret;
};

/**
 * Define some vars.
 * @includes: set {x, y, width, height, moveX, moveY...} to scaled_xxx.
 *            set {x, y, width, height} to matrix array.
 *            set origin point.
 */
var DefineScale = function DefineScale(scale) {
  var _this = this;

  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  args.forEach(function (a) {
    if (a === 'matrix') {
      _this.scaled_matrix = _this.matrix.map(function (m) {
        return m.map(function (n) {
          return n * scale;
        });
      });
    } else {
      _this['scaled_' + a] = _this[a] * scale;
    }
  });
};

/**
 * @params: {x, y, width, height}
 * define matrix and origin point.
 */
var DefineMatrix = function DefineMatrix(x, y, width, height, rotate) {
  this.matrix = [[x, y], [x + width, y], [x + width, y + height], [x, y + height]];
  this.origin = [x + 0.5 * width, y + 0.5 * height];
  this.scaled_matrix = getTransformMatrix(this.origin, this.matrix, rotate);
};

var arc = function (settings, _this) {
  var draw = function draw() {
    var canvas = _this.canvas;
    var scale = _this.scale;

    if (!this.fixed) {
      DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY', 'radius');
    }

    canvas.save();
    if (this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    canvas.translate(this.scaled_x, this.scaled_y);
    if (!this.hide) {
      canvas.beginPath();
      if (!isNaN(this.startAngle) && !isNaN(this.endAngle)) {
        canvas.arc(0, 0, this.scaled_radius, Math.PI / 180 * this.startAngle, Math.PI / 180 * this.endAngle, false);
        canvas.save();
        canvas.rotate(Math.PI / 180 * this.endAngle);
        canvas.moveTo(this.scaled_radius, 0);
        canvas.lineTo(0, 0);
        canvas.restore();
        canvas.rotate(Math.PI / 180 * this.startAngle);
        canvas.lineTo(this.scaled_radius, 0);
      } else {
        canvas.arc(0, 0, this.scaled_radius, 0, Math.PI * 2);
      }
      if (this.style === 'fill') {
        canvas.fillStyle = this.color;
        canvas.fill();
      } else {
        canvas.strokeStyle = this.color;
        canvas.stroke();
      }
      canvas.closePath();
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'arc',
    draw: draw,
    style: settings.style,
    startAngle: settings.startAngle,
    endAngle: settings.endAngle,
    radius: settings.radius,
    scaled_radius: settings.radius * _this.scale
  });
};

var image = function (settings, _this) {
  // insert into images
  if (settings.src) {
    !~_this.images.indexOf(settings.src) && _this.images.push(settings.src);
  }

  var draw = function draw() {
    var canvas = _this.canvas;
    var src = settings.src;
    var scale = _this.scale;

    if (!this.fixed) {
      DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY');
    }

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if (this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    try {
      if (!this.hide) {
        if (this.sliceWidth && this.sliceHeight) {
          canvas.drawImage(_this.loader.getImg(src), this.sliceX, this.sliceY, this.sliceWidth, this.sliceHeight, this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height);
        } else {
          canvas.drawImage(_this.loader.getImg(src), this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height);
        }
      }
    } catch (error) {
      throw new Error('The picture is not loaded successfully, please check the picture url : ' + src);
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'rectangle',
    draw: draw,
    sliceWidth: settings.sliceWidth,
    sliceHeight: settings.sliceHeight,
    sliceX: settings.sliceX,
    sliceY: settings.sliceY
  });
};

var COLOR = '#555';
var LINE_WIDTH = 1;
var FONT_SIZE = 14;
var RADIUS = {
  tl: 0,
  tr: 0,
  bl: 0,
  br: 0
};

// TODO: declare shape...
function clip(_this, canvas, scale) {
  if (_this.cliping) {
    var bounding = _this.getBounding();
    if (_this.cliping.column) {
      canvas.rect(bounding.lt[0], bounding.lt[1], bounding.rt[0] - bounding.lt[0], _this.boundingHeight * scale);
    } else {
      canvas.rect(bounding.lt[0], bounding.lt[1], _this.boundingWidth * scale, bounding.rb[1] - bounding.rt[1]);
    }
    canvas.clip();
  }
}

var line = function (settings, _this) {
  var totalLength = void 0;

  var draw = function draw() {
    var canvas = _this.canvas;
    var lineCap = settings.lineCap;
    var lineJoin = settings.lineJoin;
    var smooth = settings.smooth;
    var scale = _this.scale;

    if (this.matrix && this.matrix.length < 2) {
      throw 'The line needs at least two points';
    }

    if (!this.fixed) {
      DefineScale.call(this, scale, 'moveX', 'moveY', 'matrix', 'lineWidth');
    }

    var matrix = this.scaled_matrix;

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if (this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }

    // clip path
    clip(this, canvas, scale);

    if (!this.hide) {
      canvas.beginPath();
      canvas.lineWidth = this.scaled_lineWidth;
      canvas.strokeStyle = this.color;
      canvas.lineDashOffset = this.offset;
      if (this.dash && isArr(this.dash)) {
        canvas.setLineDash(this.dash);
      }
      if (lineCap) {
        canvas.lineCap = lineCap;
      }
      if (lineJoin) {
        canvas.lineJoin = lineJoin;
      }
      if (smooth) {
        var getCtrlPoint = function getCtrlPoint(ps, i, a, b) {
          var pAx = void 0,
              pAy = void 0,
              pBx = void 0,
              pBy = void 0;
          if (!a || !b) {
            a = 0.25;
            b = 0.25;
          }
          if (i < 1) {
            pAx = ps[0][0] + (ps[1][0] - ps[0][0]) * a;
            pAy = ps[0][1] + (ps[1][1] - ps[0][1]) * a;
          } else {
            pAx = ps[i][0] + (ps[i + 1][0] - ps[i - 1][0]) * a;
            pAy = ps[i][1] + (ps[i + 1][1] - ps[i - 1][1]) * a;
          }
          if (i > ps.length - 3) {
            var last = ps.length - 1;
            pBx = ps[last][0] - (ps[last][0] - ps[last - 1][0]) * b;
            pBy = ps[last][1] - (ps[last][1] - ps[last - 1][1]) * b;
          } else {
            pBx = ps[i + 1][0] - (ps[i + 2][0] - ps[i][0]) * b;
            pBy = ps[i + 1][1] - (ps[i + 2][1] - ps[i][1]) * b;
          }
          return {
            pA: { x: pAx, y: pAy },
            pB: { x: pBx, y: pBy }
          };
        };
        for (var i = 0; i < matrix.length; i++) {
          if (i === 0) {
            canvas.moveTo(matrix[i][0], matrix[i][1]);
          } else {
            var cMatrix = getCtrlPoint(matrix, i - 1);
            canvas.bezierCurveTo(cMatrix.pA.x, cMatrix.pA.y, cMatrix.pB.x, cMatrix.pB.y, matrix[i].x, matrix[i].y);
          }
        }
      } else {
        matrix.forEach(function (point, i) {
          i === 0 ? canvas.moveTo(point[0], point[1]) : canvas.lineTo(point[0], point[1]);
        });
      }
      canvas.stroke();
      canvas.closePath();
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'line',
    draw: draw,
    totalLength: totalLength,
    lineWidth: settings.lineWidth || 1,
    dash: settings.dash,
    offset: settings.offset || 0,
    color: settings.color || COLOR,
    matrix: settings.matrix,
    scaled_matrix: settings.matrix
  });
};

var rectangle = function (settings, _this) {
  var draw = function draw() {
    var canvas = _this.canvas;
    var scale = _this.scale;

    if (!this.fixed) {
      DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY');
    }
    DefineMatrix.call(this, this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height, this.rotate);

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);

    if (this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    // clip path
    clip(this, canvas, scale);

    if (!this.hide) {
      canvas.beginPath();
      var matrix = this.scaled_matrix;
      var radius = this.radius;

      canvas.moveTo(matrix[0][0] + radius.tl * scale, matrix[0][1]);
      canvas.lineTo(matrix[1][0] - radius.tr * scale, matrix[0][1]);
      canvas.quadraticCurveTo(matrix[1][0], matrix[0][1], matrix[1][0], matrix[0][1] + radius.tr * scale);
      canvas.lineTo(matrix[1][0], matrix[2][1] - radius.br * scale);
      canvas.quadraticCurveTo(matrix[1][0], matrix[2][1], matrix[1][0] - radius.br * scale, matrix[2][1]);
      canvas.lineTo(matrix[0][0] + radius.bl * scale, matrix[2][1]);
      canvas.quadraticCurveTo(matrix[0][0], matrix[2][1], matrix[0][0], matrix[2][1] - radius.bl * scale);
      canvas.lineTo(matrix[0][0], matrix[0][1] + radius.tl * scale);
      canvas.quadraticCurveTo(matrix[0][0], matrix[0][1], matrix[0][0] + radius.tl * scale, matrix[0][1]);

      if (this.style !== 'stroke') {
        canvas.fillStyle = this.color || COLOR;
        canvas.fill();
      } else {
        canvas.strokeStyle = this.color || COLOR;
        canvas.lineWidth = this.lineWidth;
        canvas.stroke();
      }
      canvas.closePath();
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'polygon',
    draw: draw,
    rotate: !settings.radius ? settings.rotate : 0,
    radius: settings.radius || RADIUS
  });
};

var text = function (settings, _this) {
  // insert into images
  if (settings.background && settings.background.img) {
    !~_this.images.indexOf(settings.background.img) && _this.images.push(settings.background.img);
  }

  function text_ellipsis(ctx, str, maxWidth) {
    var width = ctx.measureText(str).width,
        ellipsis = '...',
        ellipsisWidth = ctx.measureText(ellipsis).width;

    if (width <= maxWidth || width <= ellipsisWidth) {
      return str;
    } else {
      var len = str.length;
      while (width >= maxWidth - ellipsisWidth && len-- > 0) {
        str = str.substring(0, len);
        width = ctx.measureText(str).width;
      }
      return str + ellipsis;
    }
  }

  var draw = function draw() {
    var canvas = _this.canvas;
    var scale = _this.scale;
    var center = settings.center;
    var fontFamily = settings.fontFamily || 'arial,sans-serif';
    var fontSize = settings.fontSize || FONT_SIZE;
    var fontWeight = settings.fontWeight || 400;
    var size = fontSize * scale;
    var font = 'normal ' + fontWeight + ' ' + size + 'px ' + fontFamily;

    if (!this.fixed) {
      DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY', 'paddingTop', 'paddingLeft');
    }

    var textWidth = void 0,
        ellipsisText = void 0;

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if (this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }

    if (!this.hide) {
      if (this.background) {
        if (this.background.color) {
          canvas.save();
          canvas.fillStyle = this.background.color;
          canvas.fillRect(this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height);
          canvas.restore();
        } else if (this.background.img) {
          canvas.drawImage(_this.loader.getImg(this.background.img), this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height);
        }
      }
      canvas.font = font;
      canvas.textBaseline = 'top';

      textWidth = canvas.measureText(this.text).width;
      ellipsisText = text_ellipsis(canvas, this.text, this.scaled_width - 8);

      if (this.style === 'stroke') {
        canvas.strokeStyle = this.color;
        if (center) {
          if (textWidth < this.scaled_width - 8) {
            canvas.strokeText(ellipsisText, this.scaled_x + this.scaled_paddingLeft + (this.scaled_width - textWidth - 8) / 2, this.scaled_y + this.scaled_paddingTop);
          }
        } else {
          canvas.strokeText(ellipsisText, this.scaled_x + this.scaled_paddingLeft, this.scaled_y + this.scaled_paddingTop);
        }
      } else {
        canvas.fillStyle = this.color;
        if (center) {
          if (textWidth < this.scaled_width - 8) {
            canvas.fillText(ellipsisText, this.scaled_x + this.scaled_paddingLeft + (this.scaled_width - textWidth - 8) / 2, this.scaled_y + this.scaled_paddingTop);
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
};

var polygon = function (settings, _this) {
  var draw = function draw() {
    var canvas = _this.canvas;
    var scale = _this.scale;

    if (!this.fixed) {
      DefineScale.call(this, scale, 'moveX', 'moveY', 'matrix', 'lineWidth');
    }

    var matrix = this.scaled_matrix;

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);
    if (this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    if (!this.hide) {
      // clip path
      canvas.beginPath();
      clip(this, canvas, scale);
      canvas.closePath();
      canvas.beginPath();

      matrix.forEach(function (point, i) {
        i === 0 ? canvas.moveTo(point[0], point[1]) : canvas.lineTo(point[0], point[1]);
      });
      canvas.lineTo(matrix[0][0], matrix[0][1]);

      if (this.style === 'fill') {
        canvas.fillStyle = this.color;
        canvas.fill();
      } else {
        canvas.strokeStyle = this.color;
        canvas.lineWidth = this.scaled_lineWidth;
        canvas.stroke();
      }
      canvas.closePath();
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'polygon',
    draw: draw,
    style: settings.style || 'fill',
    color: settings.color || COLOR,
    lineWidth: settings.lineWidth || 1,
    matrix: settings.matrix,
    scaled_matrix: settings.matrix
  });
};

var shapes = {
  arc: arc,
  image: image,
  line: line,
  rectangle: rectangle,
  text: text,
  polygon: polygon
};

/**
 * A group is a container that can be inserted into child nodes
 */

// import getBounding from './bounding';
var group = function (settings, _this) {
  var draw = function draw() {
    var canvas = _this.canvas;
    var scale = _this.scale;

    DefineScale.call(this, scale, 'x', 'y', 'width', 'height', 'moveX', 'moveY');
    DefineMatrix.call(this, this.scaled_x, this.scaled_y, this.scaled_width, this.scaled_height);

    canvas.save();
    canvas.translate(this.scaled_moveX, this.scaled_moveY);

    if (this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }

    canvas.beginPath();
    var matrix = this.scaled_matrix;
    var radius = this.radius;

    canvas.moveTo(matrix[0][0] + radius.tl * scale, matrix[0][1]);
    canvas.lineTo(matrix[1][0] - radius.tr * scale, matrix[0][1]);
    canvas.quadraticCurveTo(matrix[1][0], matrix[0][1], matrix[1][0], matrix[0][1] + radius.tr * scale);
    canvas.lineTo(matrix[1][0], matrix[2][1] - radius.br * scale);
    canvas.quadraticCurveTo(matrix[1][0], matrix[2][1], matrix[1][0] - radius.br * scale, matrix[2][1]);
    canvas.lineTo(matrix[0][0] + radius.bl * scale, matrix[2][1]);
    canvas.quadraticCurveTo(matrix[0][0], matrix[2][1], matrix[0][0], matrix[2][1] - radius.bl * scale);
    canvas.lineTo(matrix[0][0], matrix[0][1] + radius.tl * scale);
    canvas.quadraticCurveTo(matrix[0][0], matrix[0][1], matrix[0][0] + radius.tl * scale, matrix[0][1]);

    if (isObj(this.background)) {
      var bg = this.background;
      if (bg.color) {
        canvas.fillStyle = bg.color || COLOR;
        canvas.fill();
      }
    } else if (isObj(this.border)) {
      var _border = this.border;
      canvas.strokeStyle = _border.color || COLOR;
      canvas.lineWidth = _border.lineWidth || LINE_WIDTH;
      canvas.stroke();
    }
    canvas.closePath();
    var title = this.title;
    if (title && (typeof title === 'undefined' ? 'undefined' : _typeof(title)) === 'object') {
      var size = title.fontSize || 14;
      var paddingTop = title.paddingTop || 4;
      var paddingLeft = title.paddingLeft || 2;
      canvas.fillStyle = title.color || '#000';
      canvas.textBaseline = 'top';
      canvas.font = 'normal 400 ' + size * scale + 'px ' + (title.fontFamily || 'arial,sans-serif');
      canvas.fillText(title.text, this.scaled_x + paddingLeft * scale, this.scaled_y + paddingTop * scale);
    }
    canvas.restore();
  };

  // update child's moveX and moveY
  var updateChild = function updateChild(child) {
    if (!child.updated || child.forceUpdate) {
      child.updated = true;
      child.moveX = child.parent.x + child.parent.moveX;
      child.moveY = child.parent.y + child.parent.moveY;
      child.enableChangeIndex = false;
      child.fixed = false;
      child.drag = false;
    }
  };

  var updateAllChildsPosition = function updateAllChildsPosition() {
    this.children.forEach(function (child) {
      child.moveX = child.parent.x + child.parent.moveX;
      child.moveY = child.parent.y + child.parent.moveY;
    });
  };

  /**
   * @param {Array} childs
   */
  var add = function add(childs) {
    var _this2 = this;

    if (!isArr(childs)) {
      throw 'The parameter must be an array';
    }
    if (!~this._.objects.indexOf(this)) {
      throw 'before add, please addChild the parent!';
    }

    childs.forEach(function (child) {
      if (child.isShape) {
        child.parent = _this2;
        _this2._.groupRecords += 0.0000000001;
        child.zindex = _this2.zindex + _this2._.groupRecords;
        updateChild(child);
        // group暂时不添加拖拽
        _this2.enableDrag = false;
        _this2.children.push(child);
      }
    });
    insertArray(this._.objects, this._.objects.indexOf(this) + 1, 0, childs);
    this._.objects.sort(function (a, b) {
      return a.zindex - b.zindex;
    });
    this._._objects = reverse(this._.objects);
  };

  var remove = function remove(childs) {
    var _this3 = this;

    var list = childs;
    if (typeof childs === 'function') {
      list = this.children.filter(childs);
    } else if (!isArr(childs)) {
      list = [childs];
    }
    list.forEach(function (child) {
      var index = _this3.children.indexOf(child);
      if (~index) {
        child.parent = null;
        _this3.children.splice(index, 1);
        _this3._.objects = _this3._.objects.filter(function (o) {
          return o !== child;
        });
        _this3._._objects = reverse(_this3._.objects);
      }
    });
  };

  return Object.assign({}, display(settings, _this), {
    type: 'group',
    draw: draw,
    background: settings.background,
    border: settings.border,
    radius: settings.radius || RADIUS,
    title: settings.title,
    children: [],
    add: add,
    remove: remove,
    updateAllChildsPosition: updateAllChildsPosition
  });
};

/**
 * Export for extend shapes.
 */



var ext = Object.freeze({
	display: display,
	DefineScale: DefineScale,
	DefineMatrix: DefineMatrix
});

var OMG = function () {
  // graphs contains all graphs' instance.

  // All shapes function.
  // shapes
  // The image list for preload.
  // Enable global translate?
  // Export functions for extends custom graphs.
  // canvas's with
  // Element canvas.
  // Instance of class event.
  // All supported event types list.
  // Real-time fps.
  // An object contains animationId
  // Whether the page is animating
  // Class Tween
  // Global mousedown function.
  // Instance of imageLoader
  // Ture or a function can be define. Before render, will load images first.
  // If prepareImage is a function, will trigger after images loaded.
  // Maximum scale rate
  // Default scale rate
  // The number of global translate x
  // All shapes list's reverse list
  // Current device is mobile phone
  function OMG(config) {
    classCallCheck(this, OMG);


    this.version = version;

    this.isMobile = isMobile();

    this.objects = [];

    this.groupRecords = 0, this.transX = 0;

    this.transY = 0;

    this.deviceScale = config.deviceScale || 1;

    this.minDeviceScale = config.minDeviceScale || 0.5 * this.deviceScale;

    this.maxDeviceScale = config.maxDeviceScale || 4 * this.deviceScale;

    this.scale = this.deviceScale;

    this.loader = new ImageLoader();

    this.prepareImage = config.prepareImage;

    this.globalMousedown = void 0;

    this.globalMousemove = void 0;

    this.Tween = Tween;

    this.animationList = [];

    this.animationId = 0;

    this.animating = false;

    this.cacheIdPool = {};

    this.fpsFunc = void 0;

    this.fps = 0;

    this.fpsCacheTime = 0;

    this.graphs = {};

    this.eventTypes = ['click', 'mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'drag', 'dragend', 'dragin', 'dragout', 'drop'];

    this.mobileEventTypes = ['touchstart', 'touchend', 'touchmove', 'tap', 'pinch', 'spread', 'drag', 'dragend', 'dragin', 'dragout', 'drop'];

    this._event = event(this, this.isMobile);

    this.color = new Color();

    this.element = config.element;

    this.canvas = this.element.getContext('2d');

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
  } // Group instance
  // Some helper functions
  // Enable global scale?
  // Export clip function.
  // canvas's height
  // canvas.getContext2D()
  // Class color.
  // All supported mobile event types list.
  // Used to cache timestamps which used to calculate fps.
  // If define fpsFunc, can get real-time fps.
  // Animation's id.
  // The List contains page's all animation instance.
  // Global mousemove function.
  // Current scale rate
  // Minimum scale rate
  // The number of global translate y
  // For generating and recording the graphs' zindex in a group
  // All shapes list
  // OMG's current version


  createClass(OMG, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      var _loop = function _loop(shape) {
        _this2.graphs[shape] = function (settings) {
          return _this2.shapes[shape](settings, _this2);
        };
      };

      for (var shape in this.shapes) {
        _loop(shape);
      }

      this.group = function (settings) {
        return group(settings, this);
      };
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.transX = 0;
      this.transY = 0;
      this.scale = this.deviceScale;
      this.objects.filter(function (o) {
        return !o.parent;
      }).forEach(function (o) {
        o.moveX = 0;
        o.moveY = 0;
      });
      this.objects.filter(function (o) {
        return o.type === 'group';
      }).forEach(function (o) {
        o.updateAllChildsPosition();
      });
      this._objects = reverse(this.objects);
      this.redraw();
    }
  }, {
    key: 'extend',
    value: function extend(ext) {
      for (var key in ext) {
        this.shapes[key] = ext[key];
      }
    }

    // Confused flow.

  }, {
    key: 'setGlobalProps',
    value: function setGlobalProps(props) {
      for (var key in props) {
        switch (key) {
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

  }, {
    key: 'addChild',
    value: function addChild(child) {
      // multi or single
      if (isArr(child)) {
        this.objects = this.objects.concat(child);
      } else if (isObj(child)) {
        this.objects.push(child);
      }
      this.objects.sort(function (a, b) {
        return a.zindex - b.zindex;
      });
      // copy the reverse events array
      this._objects = reverse(this.objects);
    }
  }, {
    key: 'removeChild',
    value: function removeChild(child) {
      if (isArr(child)) {
        this.objects = this.objects.filter(function (o) {
          return !~child.indexOf(o);
        });
      } else {
        this.objects = this.objects.filter(function (o) {
          return o !== child;
        });
      }
      this._objects = reverse(this.objects);
    }
  }, {
    key: 'removeFirstChild',
    value: function removeFirstChild() {
      this.objects.pop();
      this._objects = reverse(this.objects);
    }
  }, {
    key: 'removeLastChild',
    value: function removeLastChild() {
      this.objects.shift();
      this._objects = reverse(this.objects);
    }
  }, {
    key: 'removeAllChilds',
    value: function removeAllChilds() {
      this.objects = [];
      this._objects = [];
    }
  }, {
    key: 'imgReady',
    value: function imgReady() {
      this.loader.addImg(this.images);
    }
  }, {
    key: 'show',
    value: function show() {
      var _this3 = this;

      var _this = this;
      // dirty, ready to remove
      if (this.prepareImage) {
        this.imgReady();
        this.loader.ready(function () {
          typeof _this3.prepareImage === 'function' && _this3.prepareImage();
          _this.draw();
          _this._event.triggerEvents();
        });
      } else {
        this.draw();
        this._event.triggerEvents();
      }
    }
  }, {
    key: 'draw',
    value: function draw() {
      this.objects.forEach(function (item) {
        item.draw();
      });
    }
  }, {
    key: 'redraw',
    value: function redraw() {
      this.clear();
      this.canvas.save();
      this.canvas.translate(this.transX, this.transY);
      this.draw();
      this.canvas.restore();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.canvas.clearRect(0, 0, this.width, this.height);
    }
  }, {
    key: 'tick',
    value: function tick() {
      var _this4 = this;

      var func = function func() {
        if (_this4.fpsFunc) {
          var now = Date.now();
          if (now - _this4.fpsCacheTime >= 1000) {
            _this4.fpsFunc && _this4.fpsFunc(_this4.fps);
            _this4.fps = 0;
            _this4.fpsCacheTime = now;
          } else {
            _this4.fps++;
          }
        }
        _this4.animationList.forEach(function (t, i) {
          // if finished, remove it
          if (t.finished) {
            _this4.animationList.splice(i--, 1);
          } else if (t.update) {
            t.update();
          } else {
            t();
          }
        });
        _this4.redraw();
        if (_this4.animationList.length === 0 && _this4.animating) {
          _this4.animating = false;
          _this4.finishAnimation();
          cancelAnimationFrame(_this4.cacheIdPool[_this4.animationId]);
        } else {
          _this4.cacheIdPool[_this4.animationId] = requestAnimationFrame(func);
        }
      };
      if (this.animationList.length > 0 && !this.animating) {
        this.animating = true;
        this.animationId = Date.now();
        func();
      }
      return this.animationId;
    }
  }, {
    key: 'finishAnimation',
    value: function finishAnimation() {}

    /**
     * @param {func | Function}
     * The func you get the fps and do something.
     *
     * eg.
     * stage.fpsOn(function(fps) {
     *   console.log(fps);
     * });
     */

  }, {
    key: 'fpsOn',
    value: function fpsOn(func) {
      this.fpsFunc = func;
      this.fpsCacheTime = Date.now();
    }
  }, {
    key: 'fpsOff',
    value: function fpsOff() {
      this.fpsFunc = void 0;
      this.fps = 0;
    }

    // add an animation to animationList.

  }, {
    key: 'animate',
    value: function animate(func) {
      this._event.triggerEvents();
      this.animationList.push(func);
      this.tick();
    }

    // clear all animations, includes global animation and shape animations.

  }, {
    key: 'clearAnimation',
    value: function clearAnimation() {
      this.animationList = [];
      this.animating = false;
      cancelAnimationFrame(this.cacheIdPool[this.animationId]);
    }

    // get current version

  }, {
    key: 'getVersion',
    value: function getVersion() {
      return this.version;
    }

    // global mousedown event.

  }, {
    key: 'mousedown',
    value: function mousedown(func) {
      this.globalMousedown = func;
    }

    // global mousemove event

  }, {
    key: 'mousemove',
    value: function mousemove(func) {
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

  }, {
    key: 'resize',
    value: function (_resize) {
      function resize(_x) {
        return _resize.apply(this, arguments);
      }

      resize.toString = function () {
        return _resize.toString();
      };

      return resize;
    }(function (opt) {
      var _this5 = this;

      var update = function update() {
        _this5.width = opt.width();
        _this5.height = opt.height();
        autoscale([_this5.element], {
          width: _this5.width,
          height: _this5.height,
          position: 'absolute'
        });
        _this5.redraw();
      };
      if (!window.onresize) {
        bind(window, 'resize', function () {
          if (opt.resize) {
            opt.resize(update);
          } else {
            update();
          }
        });
      }
    })
  }]);
  return OMG;
}();

/**
 ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
          ___                    ___                    ___       │
 │       /  /\                  /  /\                  /  /\
        /  /::\                /  /::|                /  /::\     │
 │     /  /:/\:\              /  /:|:|               /  /:/\:\
      /  /:/  \:\            /  /:/|:|__            /  /:/  \:\   │
 │   /__/:/ \__\:\          /__/:/_|::::\          /__/:/_\_ \:\
     \  \:\ /  /:/          \__\/  /~~/:/          \  \:\__/\_\/  │
 │    \  \:\  /:/                 /  /:/            \  \:\ \:\
       \  \:\/:/                 /  /:/              \  \:\/:/    │
 │      \  \::/                 /__/:/                \  \::/
         \__\/                  \__\/                  \__\/      │
 │
  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
*/

var index = (function (config) {
  return new OMG(config);
});

return index;

})));
