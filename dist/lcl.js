
// Source: src/header.js
;(function(){

// Source: src/core.js

  var LCL = {

    version: '1.2.0',

    objects: [],

    canvas: null,

    transX: 0,

    transY: 0,

    scale: 1,

    drawUtils: {},

    loader: null, // the instance of image loader

    utils: {},

    images: [],

    isDragging: false,

    eventTypes: ['mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'drag', 'dragend', 'dragin', 'dragout', 'drop'],

    core: function(config) {

      if(!(config instanceof Object)) {
        console.warn('no canvas element!');
        return;
      }
      LCL.element = this.element = config.element,

      this.canvas = LCL.canvas = this.element.getContext('2d');

      config.element.width = this.width = LCL.width = config.width;

      config.element.height = this.height = LCL.height = config.height;

      LCL.enableGlobalTranslate = config.enableGlobalTranslate;

      LCL.drawUtils.clear = this.clear;
      LCL.drawUtils.draw = this.draw;
      LCL.drawUtils.redraw = this.redraw;

      // init images
      if(config.images) {
        LCL.images = config.images;
      }

    },

    init: function(config) {
      return new LCL.core(config);
    }

  };

  LCL.core.prototype = {

    imgReady: function() {
      LCL.loader = new LCL.utils.imageLoader();
      LCL.loader.addImg(LCL.images);
    },

    addChild: function(obj) {
      LCL.objects.push(obj);
      // copy the reverse events array
      LCL._objects = LCL.utils.reverse(LCL.objects);
    },

    show: function() {
      this.imgReady();
      LCL.loader.ready(function() {
        LCL.drawUtils.draw();
        LCL.event.triggerEvents();
      });
    },

    draw: function() {
      LCL.objects.forEach(function(item) {
        item.draw();
      });
    },

    redraw: function() {
      LCL.drawUtils.clear();
      LCL.canvas.save();
      LCL.canvas.translate(LCL.transX, LCL.transY);
      // LCL.canvas.scale(LCL.scale, LCL.scale);
      LCL.drawUtils.draw();
      LCL.canvas.restore();
    },

    clear: function() {
      LCL.canvas.clearRect(0, 0, LCL.width, LCL.height);
    },

    animate: function(func, name) {
      LCL.event.triggerEvents();
      var id = new Date().getTime();
      var _func = function() {
        func();
        LCL[id] = requestAnimationFrame(_func);
      }
      _func();
      return id;
    },

    stop: function(id) {
      cancelAnimationFrame(LCL[id]);
    },

    globalTranslate: function(bool) {
      if(typeof bool !== 'boolean' || !bool) {
        return;
      }
      LCL.enableGlobalTranslate = true;
    },

    // scaleCanvas: function(bool) {
    //   if(typeof bool !== 'boolean' || !bool) {
    //     return;
    //   }
    //   var that = this;
    //   LCL.bind(this.element, 'wheel', function(e) {
    //     if(e.deltaY < 0) {
    //       if(LCL.scale <= 3) {
    //         LCL.scale += 0.02;
    //         that.redraw();
    //       }
    //     } else {
    //       if(LCL.scale > 0.5) {
    //         LCL.scale -= 0.02;
    //         that.redraw();
    //       }
    //     }
    //   });
    // }

  }

// Source: src/display.js

  LCL.display = function(settings) {

    var settingsData = {

      fillColor: settings.fillColor, // rectangle fillcolor

      sliceX: settings.sliceX, // image sliceX

      sliceY: settings.sliceY, // image sliceY

      width: settings.width, // image

      height: settings.height, // image

      sliceWidth: settings.sliceWidth, // image

      sliceHeight: settings.sliceHeight, // image

      backgroundColor: settings.backgroundColor, //text

      text: settings.text // text

    };

    // bind event
    var on = function(eventTypes, callback) {

      if(!eventTypes) {
        throw 'no eventTypes defined!';
      }

      if(!callback || typeof callback !== 'function') {
        throw 'you need defined a callback!';
      }

      this.events = this.events || [];

      var eTypes = eventTypes.split(' '), that = this;

      eTypes.forEach(function(event) {
        if(~LCL.eventTypes.indexOf(event)) {
          that.events.push({
            eventType: event,
            callback: callback
          });
        } else {
          console.warn(event + ' is not in eventTypes!');
        }
      });

      return this;

    };

    // whether pointer is inner this shape
    var isPointInner = function(x, y) {
      var ltx = this.fixed ? 0 : LCL.transX;
      var lty = this.fixed ? 0 : LCL.transY;
      // rotate the x and y coordinates
      // var cX = this.startX + this.width/2 + ltx + this.moveX, cY = this.startY + this.height/2 + lty + this.moveY;
      // var oX = (x - cX)*Math.cos((Math.PI/180)*(-this.rotate)) - (y - cY)*Math.sin((Math.PI/180)*(-this.rotate)) + cX;
      // var oY = (x - cX)*Math.sin((Math.PI/180)*(-this.rotate)) + (y - cY)*Math.cos((Math.PI/180)*(-this.rotate)) + cY;
      // var xRight = oX > this.startX + ltx+ this.moveX;
      // var xLeft = oX < this.startX + this.width + ltx+ this.moveX;
      // var yTop = oY > this.startY + lty + this.moveY;
      // var yBottom = oY < this.startY + this.height + lty + this.moveY;
      var xRight = x > this.startX + this.moveX + ltx;
      var xLeft = x < this.startX + this.width + this.moveX + ltx;
      var yTop = y > this.startY + this.moveY + lty;
      var yBottom = y < this.startY + this.height + this.moveY + lty;

      switch(this.type) {
        case 'rectangle':
        case 'image':
        case 'text':
          return !!(xRight && xLeft && yTop && yBottom);
        case 'arc':
          return !!( Math.sqrt( (x - this.x - this.moveX -ltx) * (x - this.x - this.moveX -ltx) + (y - this.y - this.moveY - lty) * (y - this.y - this.moveY - lty) ) <= this.radius );
      }
    };

    var config = function(obj) {
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
      return this;
    };

    // whether this shape can be dragged
    var drag = function(bool) {
      if(!bool || typeof bool !== 'boolean') {
        return;
      }
      this.enableDrag = true;
    };

    // when select this shape, whether it should be changed the index
    var changeIndex = function(bool) {
      if(!bool || typeof bool !== 'boolean') {
        return;
      }
      this.enableChangeIndex = true;
    };

    var fixed = function(bool) {
      if(!bool || typeof bool !== 'boolean') {
        return;
      }
      this.fixed = true;
    }

    return Object.assign({}, settingsData, {

      isDragging: false,

      hasEnter: false,

      hasDraggedIn: false,

      //rotate: 0,

      moveX: 0,

      moveY: 0,

      on: on,

      isPointInner: isPointInner,

      config: config,

      drag: drag,

      changeIndex: changeIndex

    });

  };



// Source: src/shapes/rectangle.js

  ;(function() {// eslint-disable-line  

    var rectangle = function(settings) {

      var draw = function() {
        var canvas = LCL.canvas,
          startX = this.startX = settings.startX,
          startY = this.startY = settings.startY,
          width = this.width = settings.width,
          height = this.height = settings.height;

        canvas.save();
        // canvas.translate( startX + width/2 + this.moveX, startY + height/2 + this.moveY);
        // canvas.rotate((Math.PI/180)*this.rotate);
        // canvas.translate(-( startX + width/2 + this.moveX), -( startY + height/2 + this.moveY));
        canvas.translate(this.moveX, this.moveY);
        if(this.fixed) {
          canvas.translate(-LCL.transX, -LCL.transY);
        }
        canvas.fillStyle = this.fillColor ? this.fillColor : '#000';
        canvas.fillRect(startX, startY, width, height);
        canvas.restore();
      };

      return Object.assign({}, LCL.display(settings), {
        type: 'rectangle',
        draw: draw
      });
    };

    LCL.rectangle = rectangle;

  })();

// Source: src/shapes/line.js

  ;(function() {// eslint-disable-line

    var line = function(settings) {

      var draw = function() {
        var canvas = LCL.canvas,
          startX = settings.startX,
          startY = settings.startY,
          endX = settings.endX,
          endY = settings.endY;

        canvas.save();
        // canvas.translate(startX + (endX - startX)/2, startY + (endY - startY)/2);
        // canvas.rotate((Math.PI/180)*this.rotate);
        // canvas.translate(-(startX + (endX - startX)/2), -(startY + (endY - startY)/2));
        canvas.translate(this.moveX, this.moveY);
        canvas.beginPath();
        canvas.moveTo(startX, startY);
        canvas.lineTo(endX, endY);
        canvas.stroke();
        canvas.closePath();
        canvas.restore();
      };

      return Object.assign({}, LCL.display(settings), {
        type: 'line',
        draw: draw
      });
    };

    LCL.line = line;

  })();

// Source: src/shapes/image.js

  ;(function() {// eslint-disable-line  

    var image = function(settings) {

      // insert into images
      if(settings.src) {
        !~LCL.images.indexOf(settings.src) && LCL.images.push(settings.src);
      }

      var draw = function() {
        var canvas = LCL.canvas,
          startX = this.startX = settings.startX,
          startY = this.startY = settings.startY,
          src = settings.src;

        canvas.save();
        canvas.translate(this.moveX, this.moveY);
        if(this.fixed) {
          canvas.translate(-LCL.transX, -LCL.transY);
        }
        if(this.sliceWidth && this.sliceHeight) {
          canvas.drawImage(LCL.loader.getImg(src), this.sliceX, this.sliceY, this.sliceWidth, this.sliceHeight, startX, startY, this.width, this.height);
        } else {
          canvas.drawImage(LCL.loader.getImg(src), startX, startY, this.width, this.height);
        }
        canvas.restore();
      };

      return Object.assign({}, LCL.display(settings), {
        type: 'image',
        draw: draw
      });
    };

    LCL.image = image;

  })();

// Source: src/shapes/text.js

  ;(function() {// eslint-disable-line  

    var text = function(settings) {

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
        var canvas = LCL.canvas,
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
          canvas.translate(-LCL.transX, -LCL.transY);
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

      return Object.assign({}, LCL.display(settings), {
        type: 'text',
        draw: draw
      });
    };

    LCL.text = text;

  })();

// Source: src/shapes/arc.js

  ;(function() {// eslint-disable-line

    var arc = function(settings) {

      var draw = function() {
        var canvas = LCL.canvas,
          x = this.x = settings.x,
          y = this.y = settings.y,
          color = this.color = settings.color,
          type = settings.type,
          radius = this.radius = settings.radius;

        canvas.save();
        if(this.fixed) {
          canvas.translate(-LCL.transX, -LCL.transY);
        }
        canvas.translate(this.moveX, this.moveY);
        canvas.beginPath();
        canvas.arc(x, y, radius, 0, 2*Math.PI, false);
        if(type === 'fill') {
          canvas.fillStyle = color;
          canvas.fill();
        } else {
          canvas.strokeStyle = color;
          canvas.stroke();
        }
        canvas.closePath();
        canvas.restore();
      };

      return Object.assign({}, LCL.display(settings), {
        type: 'arc',
        draw: draw
      });
    };

    LCL.arc = arc;

  })();

// Source: src/event.js

  LCL.event = (function() {

    return {

      getPos: function(e) {
        var e = e || event;
        var x = e.pageX - LCL.element.offsetLeft,
          y = e.pageY - LCL.element.offsetTop;
        return {
          x: x, 
          y: y
        };
      },

      triggerEvents: function() {
        
        var that = this;
        var hasEvents = LCL.objects.some(function(item) {
          return !!item.events && Object.prototype.toString.call(item.events) === '[object Array]' && !item.isBg || item.enableDrag;
        });
        if(!hasEvents) {
          return;
        }

        var hasEnterOrMove = LCL.objects.some(function(item) {
          return item.events && item.events.some(function(i) {
            return i.eventType === 'mouseenter' || i.eventType === 'mousemove';
          }) && !item.isBg;
        });

        // mouseenter mousemove
        if(hasEnterOrMove) {
          this.mouseEnterOrMove();
        }

        LCL.utils.bind(LCL.element, 'mousedown', this.mouseDown.bind(this));
      },

      mouseEnterOrMove: function() {
        var that = this, isDragging;
        LCL.utils.bind(LCL.element, 'mousemove', function(e_moveOrEnter) {
          var mX = LCL.event.getPos(e_moveOrEnter).x;
          var mY = LCL.event.getPos(e_moveOrEnter).y;
          
          isDragging = LCL.objects.some(function(item) {
            return item.isDragging;
          });

          // trigger mouseenter and mousemove
          var movedOn = LCL._objects.filter(function(item) {
            return item.isPointInner(mX, mY) && !item.isBg;
          });

          // init the cursor
          // if(movedOn && movedOn.length > 0) {
          //   LCL.element.style.cursor = 'pointer';
          // } else {
          //   LCL.element.style.cursor = 'default';
          // }

          if(isDragging) {

            // interweaving the two shapes

            if(movedOn && movedOn.length > 1) {
              movedOn[1].events && movedOn[1].events.forEach(function(i) {
                if(i.eventType === 'dragin' && !movedOn[1].hasDraggedIn) {
                  movedOn[1].hasDraggedIn = true;
                  i.callback && i.callback();
                }
              });
            }

            // dragout handler
            var handleDragOut = function(item) {
              item.hasDraggedIn && item.events.forEach(function(i) {
                if(i.eventType === 'dragout') {
                  i.callback && i.callback();
                }
              });
              item.hasDraggedIn = false;
            };

            // Determine whether the mouse is dragged out from the shape and trigger dragout handler
            LCL._objects.some(function(item) {
              return item.hasDraggedIn && (!item.isPointInner(mX, mY) || movedOn[1] !== item) && handleDragOut(item);
            });

          } else {

            // normal mousemove
            if(movedOn && movedOn.length > 0) {
              movedOn[0].events && movedOn[0].events.forEach(function(i) {
                if(i.eventType === 'mouseenter' && !movedOn[0].hasEnter) {
                  movedOn[0].hasEnter = true;
                  i.callback && i.callback();
                } else if(i.eventType === 'mousemove') {
                  i.callback && i.callback();
                }
              });
            }

            // mouseleave handler
            var handleMoveOut = function(item) {
              item.hasEnter && item.events.forEach(function(i) {
                if(i.eventType === 'mouseleave') {
                  i.callback && i.callback();
                }
              });
              item.hasEnter = false;
            };

            // Determine whether the mouse is removed from the shape and trigger mouseleave handler
            LCL._objects.some(function(item) {
              return item.hasEnter && (!item.isPointInner(mX, mY) || movedOn[0] !== item) && handleMoveOut(item);
            });
          }

        });
      },

      mouseDown: function(e_down) {
        var that = this, whichIn, hasEventDrag, dragCb, dragEndCb;
        var hasDrags = LCL.objects.some(function(item) {
          return !!item.enableDrag;
        });

        // drag shape
        var pX = LCL.event.getPos(e_down).x;
        var pY = LCL.event.getPos(e_down).y;
        that.cacheX = pX;
        that.cacheY = pY;

        // mousedown
        var whichDown = LCL._objects.filter(function(item) {
          return item.isPointInner(pX, pY) && !item.isBg;
        });

        if(whichDown && whichDown.length > 0) {
          if(whichDown[0].enableChangeIndex) {
            that.changeOrder(whichDown[0]);
          }
          whichDown[0].events && whichDown[0].events.some(function(i) {
            return i.eventType === 'mousedown' && i.callback && i.callback();
          });
        }

        // mouseDrag
        if(hasDrags) {
          whichIn = LCL._objects.filter(function(item) {
            return item.isPointInner(pX, pY) && !item.isBg;
          });

          hasEventDrag = whichIn.length > 0 && whichIn[0].events && whichIn[0].events.some(function(item) {
            if(item.eventType === 'drag') {
              dragCb = item.callback;
            };
            return item.eventType === 'drag';
          });

          hasEventDragEnd = whichIn.length > 0 && whichIn[0].events && whichIn[0].events.some(function(item) {
            if(item.eventType === 'dragend') {
              dragEndCb = item.callback;
            };
            return item.eventType === 'dragend';
          });

          var move_Event = function(e_move) {
            var mx = LCL.event.getPos(e_move).x,
              my = LCL.event.getPos(e_move).y;

            whichIn[0].moveX = whichIn[0].moveX + mx - that.cacheX;
            whichIn[0].moveY = whichIn[0].moveY + my - that.cacheY;

            // event drag
            hasEventDrag && dragCb();

            LCL.drawUtils.redraw();
            that.cacheX = mx;
            that.cacheY = my;
            whichIn[0].isDragging = true;
          }

          var up_Event = function(e_up) {
            var uX = LCL.event.getPos(e_up).x;
            var uY = LCL.event.getPos(e_up).y;

            var upOn = LCL._objects.filter(function(item) {
              return item.isPointInner(uX, uY) && !item.isBg;
            });

            if(upOn && upOn.length > 1) {
              if(upOn[1].hasDraggedIn) {
                upOn[1].hasDraggedIn = false;
                var dp = upOn[1].events.some(function(i) {
                  return i.eventType === 'drop' && i.callback && i.callback(upOn[0]);
                });

                !dp && upOn[1].events.some(function(i) {
                  return i.eventType === 'dragout' && i.callback && i.callback();
                });
              }
            }

            // event dragend
            hasEventDragEnd && dragEndCb();

            LCL.utils.unbind(document, 'mousemove', move_Event);
            LCL.utils.unbind(document, 'mouseup', up_Event);
            whichIn[0].isDragging = false;
          };
          if(whichIn && whichIn.length > 0 && whichIn[0].enableDrag) {
            LCL.utils.bind(document, 'mousemove', move_Event);
            LCL.utils.bind(document, 'mouseup', up_Event);
          }
        }

        // global translate
        if(LCL.enableGlobalTranslate && !(whichIn && whichIn.length > 0)) {

          var move_dragCanvas = function(e_move) {
            var mx = LCL.event.getPos(e_move).x,
              my = LCL.event.getPos(e_move).y;
            LCL.transX = LCL.transX + mx - that.cacheX;
            LCL.transY = LCL.transY + my - that.cacheY;
            LCL.drawUtils.redraw();
            that.cacheX = mx;
            that.cacheY = my;
          };

          var up_dragCanvas = function() {
            LCL.utils.unbind(document, 'mousemove', move_dragCanvas);
            LCL.utils.unbind(document, 'mouseup', up_dragCanvas);
          };

          LCL.utils.bind(document, 'mousemove', move_dragCanvas);

          LCL.utils.bind(document, 'mouseup', up_dragCanvas);
        }
      },

      changeOrder: function(item) {
        var i = LCL.objects.indexOf(item);
        var cacheData = LCL.objects[i];
        LCL.objects.splice(i, 1);
        LCL.objects.push(cacheData);
        LCL._objects = LCL.utils.reverse(LCL.objects);
        LCL.drawUtils.redraw();
      }

    }

  })();

// Source: src/utils.js

  LCL.utils.bind = function(target, eventType, handler) {
    try {
      if (window.addEventListener) {
        target.addEventListener(eventType, handler, false);
      } else if (target.attachEvent) {
        target.attachEvent('on' + eventType, handler);
      } else {
        target['on' + eventType] = handler;
      }
      return target;
    } catch(e) {
      console.log(e);
    }
  };

  LCL.utils.unbind = function(target, eventType, handler) {
    try {
      if (window.removeEventListener) {
        target.removeEventListener(eventType, handler, false);
      } else if (window.detachEvent) {
        target.detachEvent(eventType, handler);
      } else {
        target['on' + eventType] = '';
      }
    } catch(e) {
      console.log(e);
    }
  };

  // do not change the origin array
  LCL.utils.reverse = function(array) {
    var length = array.length;
    var ret = [];
    for(var i = 0; i < length; i++) {
      ret[i] = array[length - i -1];
    }
    return ret;
  };

  LCL.utils.imageLoader = function() {
    this.imageList = new Array();
    this.loadNum = 0;
  };

  LCL.utils.imageLoader.prototype = {

    ready: function(callback) {
      var that = this;
      this.imageList.forEach(function(img){  
        that.loadImg(img);  
      });
      var timer = setInterval(function(){
        if(that.loadNum === that.imageList.length){
          clearInterval(timer);
          callback && callback();
        }  
      }, 50);
    },

    loadImg: function(img) {
      var that = this;
      var timer = setInterval(function(){  
        if(img.complete === true){
          that.loadNum++;  
          clearInterval(timer);  
        }  
      }, 50);
    },

    addImg: function(imageArray) {
      var that = this;
      imageArray.forEach(function(src) {
        var img = new Image();
        img.src = src;
        img.name = src;
        img.loaded = false;
        that.imageList.push(img);
      });
    },

    getImg: function(name) {
      var target;
      this.imageList.forEach(function(img){
        if(img.name == name){
          target = img;
        }
      });
      return target;
    }

  };

  // requestAnimationFrame polyfill
  ;(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    try {
      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      }
      if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };
      if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
    } catch(e) {
      console.log(e);
    }

  }());

// Source: src/footer.js
  
  if(typeof exports === 'object' && typeof module === 'object') {
    module.exports = LCL;
  } else {
    window.LCL = LCL;
  }
})();