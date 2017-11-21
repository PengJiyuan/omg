/*!
* omg.js v3.0.0-beta.0
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
  if (!window.requestAnimationFrame) { window.requestAnimationFrame = function (callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function () {
      callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  }; }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
})();

var version = "3.0.0-beta.0";

var utils = {

  getPos: function getPos(e) {
    var ev = e || event;
    var ref = [ ev.pageX, ev.pageY ];
    var x = ref[0];
    var y = ref[1];
    return {x: x, y: y};
  },

  bind: function bind(target, eventType, handler) {
    if (window.addEventListener) {
      target.addEventListener(eventType, handler, false);
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, handler);
    } else {
      target['on' + eventType] = handler;
    }
    return target;
  },

  unbind: function unbind(target, eventType, handler) {
    if (window.removeEventListener) {
      target.removeEventListener(eventType, handler, false);
    } else if (window.detachEvent) {
      target.detachEvent(eventType, handler);
    } else {
      target['on' + eventType] = '';
    }
  },

  // do not change the origin array
  reverse: function reverse(array) {
    var ref = [ array.length, [] ];
    var length = ref[0];
    var ret = ref[1];
    for(var i = 0; i < length; i++) {
      ret[i] = array[length - i -1];
    }
    return ret;
  },

  calculateCoord: function calculateCoord(max, min) {
    var gap, // return value -> gap
      retMax, // return value -> max
      absMax, // absolute value -> max
      calcMax, // converted max
      numLength; // max value length
    var ref = [ Math.abs(max), Math.abs(min) ];
    var ma = ref[0];
    var mi = ref[1];
    absMax = ma >= mi ? ma : mi;
    numLength = absMax < 1 ? absMax.toString().length : absMax.toString().length;
    calcMax = absMax < 1 ? this.formatFloat( absMax * Math.pow(10, numLength - 2), 1 ) : ( absMax / Math.pow(10, numLength - 1) );
    if(calcMax === 1 && numLength > 1) {
      calcMax = 10;
      numLength --;
    } else if(calcMax > 10) {
      var l = calcMax.toString().length;
      calcMax = calcMax / Math.pow(10, l - 1);
      numLength = numLength - l + 1;
    }

    var granularity = [
      [1, 0.2],
      [1.2, 0.2],
      [1.4, 0.2],
      [1.5, 0.3],
      [1.8, 0.3],
      [2, 0.4],
      [2.5, 0.5],
      [3, 0.5],
      [3.5, 0.5],
      [4, 0.5],
      [5, 1],
      [6, 1],
      [7, 1],
      [8, 1],
      [10, 2]
    ];

    granularity.forEach(function (item, index) {
      var pre = index === 0 ? 0 : granularity[index - 1][0];
      if(pre < calcMax && calcMax <= item[0]) {
        gap = item[1],
        retMax = item[0];
      }
    });

    return {
      gap: absMax < 1 ? ( gap / Math.pow(10, numLength - 2) ) :  ( gap * Math.pow(10, numLength - 1) ),
      max: absMax < 1 ? ( retMax / Math.pow(10, numLength - 2) ) : ( retMax * Math.pow(10, numLength - 1) )
    };
  },

  formatFloat: function formatFloat(f) {
    var m = Math.pow(10, 10);
    return parseInt(f * m, 10) / m;
  },

  getMaxMin: function getMaxMin(isX, series, xAxis) {
    var max, min, maxArray = [], minArray = [];
    series.forEach(function (item) {
      var ma = [];
      item.data.forEach(function (i) {
        if(isX) {
          ma.push(i[0]);
        } else {
          xAxis.data && xAxis.data.length > 0 ? ma.push(i) : ma.push(i[1]);
        }
      });
      maxArray.push(Math.max.apply(null, ma));
      minArray.push(Math.min.apply(null, ma));
    });
    max = Math.max.apply(null, maxArray);
    min = Math.min.apply(null, minArray);

    return { max: max, min: min };
  },

  isArr: function isArr(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

};

var Event = function Event(_this) {
  // global this
  this._ = _this;
};

Event.prototype.getPos = function getPos (e) {
  var ev = e || event;
  var ref = [ ev.pageX - this._.element.offsetLeft, ev.pageY - this._.element.offsetTop ];
    var x = ref[0];
    var y = ref[1];
  return { x: x, y: y };
};

Event.prototype.triggerEvents = function triggerEvents () {
  var hasEvents = this._.objects.some(function (item) {
    return item.events && utils.isArr(item.events) || item.enableDrag;
  });
  if(!hasEvents && !this._.enableGlobalTranslate) {
    return;
  }

  var hasEnterOrMove = this._.objects.some(function (item) {
    return item.events && item.events.some(function (i) {
      return i.eventType === 'mouseenter'
        || i.eventType === 'mousemove'
        || i.eventType === 'drag'
        || i.eventType === 'dragin'
        || i.eventType === 'dragout'
        || i.eventType === 'drop';
    });
  });

  // mouseenter mousemove
  if(hasEnterOrMove) {
    this.mouseEnterOrMove();
  }

  utils.bind(this._.element, 'mousedown', this.mouseDown.bind(this));
};

Event.prototype.mouseEnterOrMove = function mouseEnterOrMove () {
  var that = this;
  var isDragging;
  utils.bind(this._.element, 'mousemove', function (e_moveOrEnter) {
    var mX = that.getPos(e_moveOrEnter).x;
    var mY = that.getPos(e_moveOrEnter).y;

    isDragging = that._.objects.some(function (item) {
      return item.isDragging;
    });

    // trigger mouseenter and mousemove
    var movedOn = that._._objects.filter(function (item) {
      return item.isPointInner(mX, mY);
    });

    if(isDragging) {
      // dragin
      if(movedOn && movedOn.length > 1) {
        movedOn[1].events && movedOn[1].events.forEach(function (i) {
          if(i.eventType === 'dragin' && !movedOn[1].hasDraggedIn) {
            movedOn[1].hasDraggedIn = true;
            i.callback && i.callback(movedOn[1]);
          }
        });
      }

      // dragout handler
      var handleDragOut = function (item) {
        item.hasDraggedIn && item.events.forEach(function (i) {
          if(i.eventType === 'dragout') {
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
      // normal mousemove
      if(movedOn && movedOn.length > 0) {
        movedOn[0].events && movedOn[0].events.forEach(function (i) {
          if(i.eventType === 'mouseenter' && !movedOn[0].hasEnter) {
            movedOn[0].hasEnter = true;
            i.callback && i.callback(movedOn[0]);
          } else if(i.eventType === 'mousemove') {
            i.callback && i.callback(movedOn[0]);
          }
        });
      }
      // mouseleave handler
      var handleMoveOut = function (item) {
        item.hasEnter && item.events.forEach(function (i) {
          if(i.eventType === 'mouseleave') {
            i.callback && i.callback(item);
          }
        });
        item.hasEnter = false;
      };

      // Determine whether the mouse is removed from the shape and trigger mouseleave handler
      that._._objects.some(function (item) {
        return item.hasEnter && (!item.isPointInner(mX, mY) || movedOn[0] !== item) && handleMoveOut(item);
      });
    }

  });
};

Event.prototype.mouseDown = function mouseDown (e_down) {
  var that = this, whichIn, hasEventDrag, hasEventDragEnd, dragCb, dragEndCb;
  var hasDrags = this._.objects.some(function (item) {
    return item.enableDrag;
  });

  // drag shape
  var pX = this.getPos(e_down).x;
  var pY = this.getPos(e_down).y;
  that.cacheX = pX;
  that.cacheY = pY;

  // mousedown
  var whichDown = this._._objects.filter(function (item) {
    return item.isPointInner(pX, pY) && !item.isBg;
  });

  if(whichDown && whichDown.length > 0) {
    if(whichDown[0].enableChangeIndex) {
      that.changeOrder(whichDown[0]);
    }
    whichDown[0].events && whichDown[0].events.some(function (i) {
      return i.eventType === 'mousedown' && i.callback && i.callback(whichDown[0]);
    });
  }

  // mouseDrag
  if(hasDrags) {
    whichIn = that._._objects.filter(function (item) {
      return item.isPointInner(pX, pY) && !item.isBg;
    });

    hasEventDrag = whichIn.length > 0 && whichIn[0].events && whichIn[0].events.some(function (item) {
      if(item.eventType === 'drag') {
        dragCb = item.callback;
      }
      return item.eventType === 'drag';
    });

    hasEventDragEnd = whichIn.length > 0 && whichIn[0].events && whichIn[0].events.some(function (item) {
      if(item.eventType === 'dragend') {
        dragEndCb = item.callback;
      }
      return item.eventType === 'dragend';
    });

    var move_Event = function (e_move) {
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

    var up_Event = function (e_up) {
      var uX = that.getPos(e_up).x;
      var uY = that.getPos(e_up).y;

      var upOn = that._._objects.filter(function (item) {
        return item.isPointInner(uX, uY);
      });

      if(upOn && upOn.length > 1) {
        if(upOn[1].hasDraggedIn) {
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

      utils.unbind(document, 'mousemove', move_Event);
      utils.unbind(document, 'mouseup', up_Event);
      whichIn[0].isDragging = false;
    };
    if(whichIn && whichIn.length > 0 && whichIn[0].enableDrag) {
      utils.bind(document, 'mousemove', move_Event);
      utils.bind(document, 'mouseup', up_Event);
    }
  }

  // global translate
  if(this._.enableGlobalTranslate && !(whichIn && whichIn.length > 0)) {

    var move_dragCanvas = function (e_move) {
      var mx = that.getPos(e_move).x;
      var my = that.getPos(e_move).y;
      that._.transX = that._.transX + mx - that.cacheX;
      that._.transY = that._.transY + my - that.cacheY;
      that._.redraw();
      that.cacheX = mx;
      that.cacheY = my;
    };

    var up_dragCanvas = function () {
      utils.unbind(document, 'mousemove', move_dragCanvas);
      utils.unbind(document, 'mouseup', up_dragCanvas);
    };

    utils.bind(document, 'mousemove', move_dragCanvas);
    utils.bind(document, 'mouseup', up_dragCanvas);
  }
};

Event.prototype.changeOrder = function changeOrder (item) {
  var i = this._.objects.indexOf(item);
  var cacheData = this._.objects[i];
  this._.objects.splice(i, 1);
  this._.objects.push(cacheData);
  this._._objects = utils.reverse(this._.objects);
  this._.redraw();
};

var Color = function Color() {};

// converts hex to RGB
Color.prototype.hexToRGB = function hexToRGB (hex) {
  var rgb = [];

  hex = hex.substr(1);

  // converts #abc to #aabbcc
  if (hex.length === 3) {
    hex = hex.replace(/(.)/g, '$1$1');
  }

  hex.replace(/../g, function (color) {
    rgb.push(parseInt(color, 0x10));
  });

  return {
    r: rgb[0],
    g: rgb[1],
    b: rgb[2],
    rgb: ("rgb(" + (rgb.join(',')) + ")")
  };
};

// converts rgb to HSL
Color.prototype.rgbToHSL = function rgbToHSL (r, g, b) {
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max) {
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
    hsl: ("hsl(" + (h * 360) + ", " + (s * 100) + "%, " + (l * 100) + "%)")
  };
};

// converts hsl to RGB
Color.prototype.hslToRGB = function hslToRGB () {
};

// color lighten
Color.prototype.lighten = function lighten (color, percent) {
  var hsl, h, s, l, rgba, a;
  if(!color || !percent || !/^[0-9]{1,2}%$/.test(percent)) {
    return;
  }
  if(this.isRgba(color)) {
    rgba = this.getRgba(color);
    a = +rgba.a - +( percent.slice(0, -1) / 100 );
    return ("rgba(" + (rgba.r) + ", " + (rgba.g) + ", " + (rgba.b) + ", " + a + ")");
  } else {
    hsl = this.getHsl(color);
    h = +hsl.h;
    s = +hsl.s;
    l = +hsl.l * 100 + +percent.slice(0, -1);

    return ("hsl(" + (h * 360) + ", " + (s * 100) + "%, " + l + "%)");
  }
};

// color darken
Color.prototype.darken = function darken (color, percent) {
  var hsl, h, s, l, rgba, a;
  if(!color || !percent || !/^[0-9]{1,2}%$/.test(percent)) {
    return;
  }
  if(this.isRgba(color)) {
    rgba = this.getRgba(color);
    a = +rgba.a + +( percent.slice(0, -1) / 100 );
    return ("rgba(" + (rgba.r) + ", " + (rgba.g) + ", " + (rgba.b) + ", " + a + ")");
  } else {
    hsl = this.getHsl(color);
    h = +hsl.h;
    s = +hsl.s;
    l = +hsl.l * 100 - +percent.slice(0, -1);

    return ("hsl(" + (h * 360) + ", " + (s * 100) + "%, " + l + "%)");
  }
};

Color.prototype.isHex = function isHex (color) {
  return /^#[a-fA-F0-9]{3}$|#[a-fA-F0-9]{6}$/.test(color);
};

Color.prototype.isRgb = function isRgb (color) {
  return /^rgb\((\s*[0-5]{0,3}\s*,?){3}\)$/.test(color);
};

Color.prototype.isRgba = function isRgba (color) {
  return /^rgba\((\s*[0-5]{0,3}\s*,?){3}[0-9.\s]*\)$/.test(color);
};

Color.prototype.getRgb = function getRgb (color) {
  var rgb, r, g, b;
  if(this.isHex(color)) {
    rgb = this.hexToRGB(color);
    var assign;
      (assign = [ rgb.r, rgb.g, rgb.b ], r = assign[0], g = assign[1], b = assign[2]);
  } else if(this.isRgb(color)) {
    rgb = color.slice(4, -1).split(',');
    var assign$1;
      (assign$1 = [ rgb[0], rgb[1], rgb[2] ], r = assign$1[0], g = assign$1[1], b = assign$1[2]);
  }
  return { r: r, g: g, b: b };
};

Color.prototype.getRgba = function getRgba (color) {
  var rgba, r, g, b, a;
  rgba = color.slice(5, -1).split(',');
  var assign;
    (assign = [ rgba[0], rgba[1], rgba[2], rgba[3] ], r = assign[0], g = assign[1], b = assign[2], a = assign[3]);

  return { r: r, g: g, b: b, a: a };
};

Color.prototype.getHsl = function getHsl (color) {
  var hsl, rgb, r, g, b, h, s, l;
  rgb = this.getRgb(color);
  var assign;
    (assign = [ rgb.r, rgb.g, rgb.b ], r = assign[0], g = assign[1], b = assign[2]);

  hsl = this.rgbToHSL(r, g, b);
  var assign$1;
    (assign$1 = [ hsl.h, hsl.s, hsl.l ], h = assign$1[0], s = assign$1[1], l = assign$1[2]);

  return { h: h, s: s, l: l };
};

var ImageLoader = function ImageLoader() {
  this.imageList = [];
  this.loadNum = 0;
};

ImageLoader.prototype.ready = function ready (callback) {
    var this$1 = this;

  this.imageList.forEach(function (img) {
    this$1.loadImg(img);
  });
  var timer = setInterval(function () {
    if(this$1.loadNum === this$1.imageList.length){
      clearInterval(timer);
      callback && callback();
    }
  }, 50);
};

ImageLoader.prototype.loadImg = function loadImg (img) {
    var this$1 = this;

  var timer = setInterval(function () {
    if(img.complete === true){
      this$1.loadNum++;
      clearInterval(timer);
    }
  }, 50);
};

ImageLoader.prototype.addImg = function addImg (imageArray) {
    var this$1 = this;

  imageArray.forEach(function (src) {
    var img = new Image();
    img.src = src;
    img.name = src;
    img.loaded = false;
    this$1.imageList.push(img);
  });
};

ImageLoader.prototype.getImg = function getImg (name) {
  var target;
  this.imageList.forEach(function (img) {
    if(img.name == name){
      target = img;
    }
  });
  return target;
};

// https://github.com/component/autoscale-canvas/blob/master/index.js

/**
 * Retina-enable the given `canvas`.
 *
 * @param {Canvas} canvas
 * @return {Canvas}
 * @api public
 */

var autoscale = function (canvasList, opt) {
  var ratio = window.devicePixelRatio || 1,
    ctx = null;

  canvasList.forEach(function (canvas) {
    ctx = canvas.getContext('2d');
    canvas.style.width = opt.width + 'px';
    canvas.style.height = opt.height + 'px';
    canvas.width = opt.width * ratio;
    canvas.height = opt.height * ratio;
    ctx.scale(ratio, ratio);
  });

  return canvasList;
};

var isPointInner = function(x, y) {
  var mx = this.moveX;
  var my = this.moveY;
  var ltx = this.fixed ? 0 : this._.transX;
  var lty = this.fixed ? 0 : this._.transY;
  var xRight = x > this.x + mx + ltx;
  var xLeft = x < this.x + this.width + mx + ltx;
  var yTop = y > this.y + my + lty;
  var yBottom = y < this.y + this.height + my + lty;

  switch(this.type) {
    /**
     * @type: Rectangle, image, text, coord
     */
    case 'rectangle':
      return !!(xRight && xLeft && yTop && yBottom);
    /**
     * @type: Arc
     */
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
    /**
     * @type: polygon
     *
     * Return true if the given point is contained inside the boundary.
     * See: http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
     * @return true if the point is inside the boundary, false otherwise
     */
    case 'polygon':
      var points = this.matrix;
      var pgx = x - mx - ltx;
      var pgy = y - my - lty;
      var result = false;
      for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
        if ((points[i][1] > pgy) != (points[j][1] > pgy) &&
            (pgx < (points[j][0] - points[i][0]) * (pgy - points[i][1]) / (points[j][1] - points[i][1]) + points[i][0])) {
          result = !result;
        }
      }
      return result;
    default:
      break;
  }
};

var Display = function Display(settings, _this) {

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

};

Display.prototype.on = function on (eventTypes, callback) {
    var this$1 = this;

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

  var eTypes = eventTypes.split(' '), that = this;

  eTypes.forEach(function (event) {
    if(~this$1._.eventTypes.indexOf(event)) {
      that.events.push({
        eventType: event,
        callback: callback
      });
    } else {
      console.error(event + ' is not in eventTypes!');
    }
  });

  return this;
};

// whether pointer is inner this shape
Display.prototype.isPointInner = function isPointInner$1 (x, y) {
  return isPointInner.bind(this)(x, y);
};

Display.prototype.config = function config (obj) {
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
};

// whether this shape can be dragged
Display.prototype.drag = function drag (bool) {
  if(!bool || typeof bool !== 'boolean') {
    return;
  }
  this.enableDrag = true;
};

// when select this shape, whether it should be changed the index
Display.prototype.changeIndex = function changeIndex (bool) {
  if(!bool || typeof bool !== 'boolean') {
    return;
  }
  this.enableChangeIndex = true;
};

var display = function (settings, _this) {
  var display = new Display(settings, _this);

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
};

var arc = function(settings, _this) {
  var draw = function() {
    var canvas = _this.canvas,
      x = this.x = settings.x,
      y = this.y = settings.y,
      style = this.style = settings.style,
      startAngle = this.startAngle = settings.startAngle,
      endAngle = this.endAngle = settings.endAngle;

    canvas.save();
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.translate(this.moveX, this.moveY);
    canvas.translate(x, y);
    canvas.beginPath();
    if(!isNaN(startAngle) && !isNaN(endAngle)) {
      canvas.arc(0, 0, this.radius, Math.PI/180*startAngle, Math.PI/180*endAngle, false);
      canvas.save();
      canvas.rotate(Math.PI/180*endAngle);
      canvas.moveTo(this.radius, 0);
      canvas.lineTo(0, 0);
      canvas.restore();
      canvas.rotate(Math.PI/180*startAngle);
      canvas.lineTo(this.radius, 0);
    } else {
      canvas.arc(0, 0, this.radius, 0, Math.PI*2);
    }
    if(style === 'fill') {
      canvas.fillStyle = this.color;
      canvas.fill();
    } else {
      canvas.strokeStyle = this.color;
      canvas.stroke();
    }
    canvas.closePath();
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'arc',
    draw: draw,
    radius: settings.radius
  });
};

var coord = function(settings, _this) {
  var canvas = _this.canvas,
    x = this.x = settings.x,
    y = this.y = settings.y,
    width = settings.width,
    height = settings.height,
    xAxis = settings.xAxis,
    //yAxis = settings.yAxis,
    series = settings.series,
    boundaryGap = settings.boundaryGap,
    title = settings.title,
    subTitle = settings.subTitle;

  var TO_TOP = 20;

  var margin = width <= 300 ? width / 5 : width / 10;
  var xCount, yCount, xSpace, ySpace, xLength, yLength, xGapLength, yGapLength, upCount, downCount, ygl;

  // yAxis
  var maxY = utils.getMaxMin(false, series, xAxis).max,
    minY = utils.getMaxMin(false, series, xAxis).min,
    gm = utils.calculateCoord(maxY, minY),
    gap = gm.gap;
  //retMax = gm.max;

  yLength = height - 2 * margin;
  //count = Math.round(retMax / gap);

  upCount = maxY > 0 ? Math.ceil(maxY / gap) : 0;
  downCount = minY < 0 ? Math.ceil( Math.abs(minY) / gap) : 0;
  yCount = upCount + downCount;
  yGapLength = Math.round( yLength / yCount ),
  ySpace = yCount,
  ygl = yGapLength;

  // xAxis
  if(xAxis.data && xAxis.data.length > 0) {
    xCount = xAxis.data.length;
    xSpace = boundaryGap ? xCount : xCount -1;
    xLength = width - margin * 2;
    xGapLength = xLength / xSpace;
  }

  var draw = function() {

    canvas.save();
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    if(this.backgroundColor) {
      canvas.save();
      canvas.fillStyle = this.backgroundColor;
      canvas.fillRect(x, y, width, height);
      canvas.restore();
    }

    // draw title
    canvas.save();
    canvas.font = width <= 300 ? '18px serif' : '24px serif';
    canvas.textAlign = 'left';
    canvas.textBaseline = 'top';
    canvas.fillText(title, margin / 2, 10);
    canvas.restore();
    canvas.save();
    canvas.fillStyle = '#666666';
    canvas.font = width <= 300 ? '10px serif' : '14px serif';
    canvas.textAlign = 'left';
    canvas.textBaseline = 'top';
    canvas.fillText(subTitle, margin / 2 + 4, 40);
    canvas.restore();


    // draw yAxis

    // coordinate origin
    canvas.translate(x + margin, y + margin + upCount * yGapLength + TO_TOP);

    // yAxis
    canvas.beginPath();
    canvas.moveTo(0, 0 + downCount * yGapLength);
    canvas.lineTo(0, -(height - margin*2) + downCount * yGapLength - 5);
    canvas.stroke();
    canvas.closePath();

    for(var ii = 0; ii <= upCount; ii++) {
      canvas.beginPath();
      canvas.moveTo(0, -yGapLength * ii);
      canvas.lineTo(-5, -yGapLength * ii);
      canvas.stroke();
      canvas.closePath();
      // draw grid
      canvas.save();
      canvas.strokeStyle = '#ccc';
      canvas.beginPath();
      canvas.moveTo(0, -yGapLength * ii);
      canvas.lineTo(width - margin*2, -yGapLength * ii);
      canvas.stroke();
      canvas.restore();
      canvas.closePath();
      // draw label
      canvas.save();
      canvas.font = '12px serif';
      canvas.textAlign = 'right';
      canvas.textBaseline = 'middle';
      canvas.fillText( utils.formatFloat(gap*ii), -10, -yGapLength * ii);
      canvas.restore();
    }

    for(var iii = 0; iii <= downCount; iii++) {
      canvas.beginPath();
      canvas.moveTo(0, yGapLength * iii);
      canvas.lineTo(-5, yGapLength * iii);
      canvas.stroke();
      canvas.closePath();
      // draw grid
      canvas.save();
      canvas.strokeStyle = '#ccc';
      canvas.beginPath();
      canvas.moveTo(0, yGapLength * iii);
      canvas.lineTo(width - margin*2, yGapLength * iii);
      canvas.stroke();
      canvas.restore();
      canvas.closePath();
      // draw label
      canvas.save();
      canvas.font = '12px serif';
      canvas.textAlign = 'right';
      canvas.textBaseline = 'middle';
      if(iii !== 0) {
        canvas.fillText( utils.formatFloat(-gap*iii), -10, yGapLength * iii);
      }
      canvas.restore();
    }

    // xAxis
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(width - margin*2, 0);
    canvas.stroke();
    canvas.closePath();

    // draw xAxis
    if(xAxis.data && xAxis.data.length > 0) {

      xAxis.data.forEach(function(item, index) {
        canvas.beginPath();
        canvas.moveTo(xGapLength * (index + 1), 0);
        canvas.lineTo(xGapLength * (index + 1), 5);
        canvas.save();
        canvas.font = '15px serif';
        canvas.textAlign = 'center';
        canvas.textBaseline = 'top';
        boundaryGap ? canvas.fillText(item, xGapLength * index + xGapLength / 2, 5 + downCount * ygl) : canvas.fillText(item, xGapLength * index, 5 + downCount * ygl);
        canvas.restore();
        canvas.stroke();
        canvas.closePath();
      });

    }

    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'rectangle',
    draw: draw,
    xLength: xLength,
    yLength: yLength,
    xSpace: xSpace,
    ySpace: ySpace,
    xGapLength: xGapLength,
    yGapLength: yGapLength,
    upCount: upCount,
    downCount: downCount,
    gap: gap,
    margin: margin,
    TO_TOP: TO_TOP,
    boundaryGap: boundaryGap,
    backgroundColor: settings.backgroundColor || '#F3F3F3'
  });
};

var image = function(settings, _this) {
  // insert into images
  if(settings.src) {
    !~_this.images.indexOf(settings.src) && _this.images.push(settings.src);
  }

  var draw = function() {
    var canvas = _this.canvas,
      x = this.x = settings.x,
      y = this.y = settings.y,
      src = settings.src;

    canvas.save();
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    if(this.sliceWidth && this.sliceHeight) {
      canvas.drawImage(_this.loader.getImg(src), this.sliceX, this.sliceY, this.sliceWidth, this.sliceHeight, x, y, this.width, this.height);
    } else {
      canvas.drawImage(_this.loader.getImg(src), x, y, this.width, this.height);
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

var line = function(settings, _this) {
  var canvas = _this.canvas,
    matrix = settings.matrix,
    lineWidth = settings.lineWidth,
    lineCap = settings.lineCap,
    lineJoin = settings.lineJoin,
    strokeColor = settings.strokeColor,
    smooth = settings.smooth;

  var totalLength;

  var draw = function() {

    canvas.save();
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.lineWidth = lineWidth;
    canvas.strokeStyle = strokeColor;
    canvas.beginPath();
    canvas.lineDashOffset = this.offset;
    if(this.dash && Object.prototype.toString.call(this.dash) === '[object Array]') {
      canvas.setLineDash(this.dash);
    }
    if(lineCap) {
      canvas.lineCap = lineCap;
    }
    if(lineJoin) {
      canvas.lineJoin = lineJoin;
    }
    if(smooth) {
      var getCtrlPoint = function(ps, i, a, b) {
        var pAx, pAy, pBx, pBy;
        if(!a || !b) {
          a = 0.25;
          b = 0.25;
        }
        if( i < 1) {
          pAx = ps[0][0] + (ps[1][0] - ps[0][0]) * a;
          pAy = ps[0][1] + (ps[1][1] - ps[0][1]) * a;
        } else {
          pAx = ps[i][0] + (ps[i + 1][0] - ps[i - 1][0])*a;
          pAy = ps[i][1] + (ps[i + 1][1] - ps[i - 1][1])*a;
        }
        if(i > ps.length-3) {
          var last = ps.length - 1;
          pBx = ps[last][0] - (ps[last][0] - ps[last - 1][0]) * b;
          pBy = ps[last][1] - (ps[last][1] - ps[last - 1][1]) * b;
        } else {
          pBx = ps[i + 1][0] - (ps[i + 2][0] - ps[i][0]) * b;
          pBy = ps[i + 1][1] - (ps[i + 2][1] - ps[i][1]) * b;
        }
        return {
          pA:{x: pAx, y: pAy},
          pB:{x: pBx, y: pBy}
        };
      };
      for(var i = 0; i < matrix.length; i++) {
        if(i === 0) {
          canvas.moveTo(matrix[i][0], matrix[i][1]);
        } else {
          var cMatrix = getCtrlPoint(matrix, i - 1);
          canvas.bezierCurveTo(cMatrix.pA.x, cMatrix.pA.y, cMatrix.pB.x, cMatrix.pB.y, matrix[i].x, matrix[i].y);
        }
      }
    } else {
      matrix.forEach(function(point, i) {
        i === 0 ? canvas.moveTo(point[0], point[1]) : canvas.lineTo(point[0], point[1]);
      });
    }
    canvas.stroke();
    canvas.closePath();
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'line',
    draw: draw,
    totalLength: totalLength,
    dash: settings.dash,
    offset: settings.offset || 0
  });
};

var rectangle = function(settings, _this) {
  var draw = function() {
    var canvas = _this.canvas;

    canvas.save();
    // canvas.translate( x + width/2 + this.moveX, y + height/2 + this.moveY);
    // canvas.rotate((Math.PI/180)*this.rotate);
    // canvas.translate(-( x + width/2 + this.moveX), -( y + height/2 + this.moveY));
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.fillStyle = this.color ? this.color : '#000';
    canvas.fillRect(this.x, this.y, this.width, this.height);
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'rectangle',
    draw: draw
  });
};

var text = function(settings, _this) {
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

  var draw = function() {
    var canvas = _this.canvas,
      x = this.x = settings.x,
      y = this.y = settings.y,
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
      canvas.fillRect(x, y, width, height);
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
          canvas.strokeText(ellipsisText, x + 4 + (width - textWidth - 8)/2, y + pt);
        }
      } else {
        canvas.strokeText(ellipsisText, x + 4, y + pt);
      }
    } else {
      canvas.fillStyle = color;
      if(center) {
        if(textWidth < width - 8) {
          canvas.fillText(ellipsisText, x + 4 + (width - textWidth - 8)/2, y + pt);
        }
      } else {
        canvas.fillText(ellipsisText, x + 4, y + pt);
      }
    }
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'rectangle',
    draw: draw,
    backgroundColor: settings.backgroundColor,
    text: settings.text
  });
};

var polygon = function(settings, _this) {
  var canvas = _this.canvas,
    lineWidth = settings.lineWidth || 1,
    type = settings.type || 'fill';

  var draw = function() {

    canvas.save();
    canvas.translate(this.moveX, this.moveY);
    if(this.fixed) {
      canvas.translate(-_this.transX, -_this.transY);
    }
    canvas.beginPath();

    this.matrix.forEach(function (point, i) {
      i === 0 ? canvas.moveTo(point[0], point[1]) : canvas.lineTo(point[0], point[1]);
    });
    canvas.lineTo(this.matrix[0][0], this.matrix[0][1]);
    
    if(type === 'fill') {
      canvas.fillStyle = this.color;
      canvas.fill();
    } else {
      canvas.strokeStyle = this.color;
      canvas.lineWidth = lineWidth;
      canvas.stroke();
    }
    canvas.closePath();
    canvas.restore();
  };

  return Object.assign({}, display(settings, _this), {
    type: 'polygon',
    draw: draw,
    matrix: settings.matrix
  });
};

var shapes = {
  arc: arc,
  coord: coord,
  image: image,
  line: line,
  rectangle: rectangle,
  text: text,
  polygon: polygon
};

var OMG = function OMG(config) {
  var this$1 = this;


  this.version = version;

  this.objects = [];

  this.transX = 0;

  this.transY = 0;

  this.scale = 1;

  // the instance of image loader
  this.loader = null;

  this.pointerInnerArray = [];

  this.isDragging = false;

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

  this.canvas =this.element.getContext('2d');

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

  Object.keys(shapes).forEach(function (shape) {
    this$1[shape] = function(settings) {
      return shapes[shape](settings, this);
    };
  });

};

OMG.prototype.imgReady = function imgReady () {
  this.loader = new ImageLoader();
  this.loader.addImg(this.images);
};

OMG.prototype.addChild = function addChild (obj) {
  // multi or single
  if(utils.isArr(obj)) {
    this.objects = this.objects.concat(obj);
  } else {
    this.objects.push(obj);
  }
  this.objects.sort(function (a, b) {
    return a.zindex - b.zindex;
  });
  // copy the reverse events array
  this._objects = utils.reverse(this.objects);
};

OMG.prototype.show = function show () {
  var _this = this;
  this.imgReady();
  this.loader.ready(function () {
    _this.draw();
    _this._event.triggerEvents();
  });
};

OMG.prototype.draw = function draw () {
  this.objects.forEach(function (item) {
    item.draw();
  });
};

OMG.prototype.redraw = function redraw () {
  this.clear();
  this.canvas.save();
  this.canvas.translate(this.transX, this.transY);
  this.draw();
  this.canvas.restore();
};

OMG.prototype.clear = function clear () {
  this.canvas.clearRect(0, 0, this.width, this.height);
};

OMG.prototype.animate = function animate (func) {
    var this$1 = this;

  this._event.triggerEvents();
  var id = new Date().getTime();
  var _func = function () {
    func();
    this$1[id] = requestAnimationFrame(_func);
  };
  _func();
  return id;
};

OMG.prototype.stop = function stop (id) {
  cancelAnimationFrame(this[id]);
};

OMG.prototype.globalTranslate = function globalTranslate (bool) {
  if(typeof bool !== 'boolean' || !bool) {
    return;
  }
  this.enableGlobalTranslate = true;
};

OMG.prototype.getVersion = function getVersion () {
  return this.version;
};

OMG.prototype.scaleCanvas = function scaleCanvas (bool) {
  if(typeof bool !== 'boolean' || !bool) {
    return;
  }
  var that = this;
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
};

var index = function (config) {
  return new OMG(config);
};

return index;

})));
