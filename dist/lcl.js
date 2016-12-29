
// Source: src/header.js
;(function(window){

// Source: src/core.js

	var LCL = {

		version: '1.0.1',

		objects: [],

		canvas: null,

		transX: 0,

		transY: 0,

		scale: 1,

		drawUtils: {},

		eventTypes: ['mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove'],

		core: function(config) {

			if(!(config instanceof Object)) {
				console.warn('no canvas element!');
				return;
			}
			LCL.element = this.element = config.element,

			this.canvas = LCL.canvas = this.element.getContext('2d');

			config.element.width = this.width = LCL.width = config.width;

			config.element.height = this.height = LCL.height = config.height;

			LCL.drawUtils.clear = this.clear;
			LCL.drawUtils.draw = this.draw;
			LCL.drawUtils.redraw = this.redraw;

			LCL.changeIndex = config.changeIndex;

		},

		init: function(config) {
			return new LCL.core(config);
		}

	};

	LCL.core.prototype = {

		addChild: function(obj) {
			LCL.objects.push(obj);
		},

		show: function() {
			LCL.drawUtils.draw();
			LCL.event.triggerEvents();
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
			LCL.canvas.scale(LCL.scale, LCL.scale);
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

		dragCanvas: function(bool) {
			if(typeof bool !== 'boolean' || !bool) {
				return;
			}
			LCL.enableDragCanvas = true;
		},

		// scaleCanvas: function(bool) {
		// 	if(typeof bool !== 'boolean' || !bool) {
		// 		return;
		// 	}
		// 	var that = this;
		// 	LCL.bind(this.element, 'wheel', function(e) {
		// 		if(e.deltaY < 0) {
		// 			if(LCL.scale <= 3) {
		// 				LCL.scale += 0.02;
		// 				that.redraw();
		// 			}
		// 		} else {
		// 			if(LCL.scale > 0.5) {
		// 				LCL.scale -= 0.02;
		// 				that.redraw();
		// 			}
		// 		}
		// 	});
		// }

	}

// Source: src/display.js

	LCL.display = function(settings) {

		var settingsData = {

			startX: settings.startX,

			startY: settings.startY,

			width: settings.width,

			height: settings.height,

			fillColor: settings.fillColor

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
			var that = this;
			var xRight = x > this.startX*LCL.scale + LCL.transX + this.moveX;
			var xLeft = x < (this.startX + this.width)*LCL.scale + LCL.transX + this.moveX;
			var yTop = y > this.startY*LCL.scale + LCL.transY + this.moveY;
			var yBottom = y < (this.startY + this.height)*LCL.scale + LCL.transY + this.moveY;

			switch(this.type) {
				case 'rectangle':
					return !!(xRight && xLeft && yTop && yBottom);
			}
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

		return Object.assign({}, settingsData, {

			hasEnter: false,

			rotate: 0,

			moveX: 0,

			moveY: 0,

			on: on,

			isPointInner: isPointInner,

			drag: drag,

			changeIndex: changeIndex

		});

	};



// Source: src/shapes/rectangle.js
	
	;(function() {

		var rectangle = function(settings) {

			var draw = function() {
				var canvas = LCL.canvas,
					startX = settings.startX,
					startY = settings.startY,
					width = settings.width,
					height = settings.height;
					
				canvas.save();
				canvas.translate( startX + width/2 + this.moveX , startY + height/2 + this.moveY);
				canvas.rotate((Math.PI/180)*this.rotate);
				canvas.translate(-( startX + width/2 + this.moveX), -( startY + height/2 + this.moveY));
				canvas.translate(this.moveX, this.moveY);
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
	
	;(function() {

		var line = function(settings) {

			var draw = function() {
				var canvas = LCL.canvas,
					startX = settings.startX,
					startY = settings.startY,
					endX = settings.endX,
					endY = settings.endY;

				canvas.save();
				canvas.translate(startX + (endX - startX)/2, startY + (endY - startY)/2);
				canvas.rotate((Math.PI/180)*this.rotate);
				canvas.translate(-(startX + (endX - startX)/2), -(startY + (endY - startY)/2));
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
				// copy the reverse events array
				LCL._objects = LCL.reverse(LCL.objects);

				var that = this;
				var hasEvents = LCL.objects.some(function(item) {
					return !!item.events && Object.prototype.toString.call(item.events) === '[object Array]';
				});
				if(!hasEvents) {
					return;
				}

				var hasEnterOrMove = LCL.objects.some(function(item) {
					return item.events && item.events.some(function(i) {
						return i.eventType === 'mouseenter' || i.eventType === 'mousemove';
					});
				});

				// mouseenter mousemove
				if(hasEnterOrMove) {
					this.mouseEnterOrMove();
				}

				LCL.bind(LCL.element, 'mousedown', this.mouseDown.bind(this));
			},

			mouseEnterOrMove: function() {
				LCL.bind(LCL.element, 'mousemove', function(e_moveOrEnter) {
					var mX = LCL.event.getPos(e_moveOrEnter).x;
					var mY = LCL.event.getPos(e_moveOrEnter).y;

					// trigger mouseenter and mousemove
					var movedOn = LCL._objects.filter(function(item) {
						return item.events && item.events.some(function(i) {
							return i.eventType === 'mouseenter' || i.eventType === 'mousemove';
						}) && item.isPointInner(mX, mY);
					});
					if(movedOn && movedOn.length > 0) {
						movedOn[0].hasEnter = true;
						movedOn[0].events.forEach(function(i) {
							if(i.eventType === 'mouseenter' || i.eventType === 'mousemove') {
								i.callback && i.callback();
							}
						});
					}

					// trigger mouseleave
					var handleMoveOut = function(item) {
						item.hasEnter && item.events.forEach(function(i) {
							if(i.eventType === 'mouseleave') {
								i.callback && i.callback();
							}
						});
						item.hasEnter = false;
					};
					LCL._objects.some(function(item) {
						return item.hasEnter && (!item.isPointInner(mX, mY) || movedOn[0] !== item) && handleMoveOut(item);
					});
				});
			},

			mouseDown: function(e_down) {
				var that = this, whichIn;
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
					return !!item.events && Object.prototype.toString.call(item.events) === '[object Array]' && item.events.some(function(i) {
						return i.eventType = 'mousedown';
					}) && item.isPointInner(pX, pY);
				});

				if(whichDown && whichDown.length > 0) {
					if(LCL.changeIndex) {
						that.changeOrder(whichDown[0]);
					}
					whichDown[0].events.some(function(i) {
						return i.eventType === 'mousedown' && i.callback && i.callback();
					});
				}

				// mouseDrag
				if(hasDrags) {
					whichIn = LCL._objects.filter(function(item) {
						return item.enableDrag && item.isPointInner(pX, pY);
					});
					var move_Event = function(e_move) {
						var mx = LCL.event.getPos(e_move).x,
							my = LCL.event.getPos(e_move).y;

						LCL.element.style.cursor = 'pointer';
						whichIn[0].moveX = whichIn[0].moveX + mx - that.cacheX;
						whichIn[0].moveY = whichIn[0].moveY + my - that.cacheY;
						LCL.drawUtils.redraw();
						that.cacheX = mx;
						that.cacheY = my;
					}

					var up_Event = function() {
						LCL.element.style.cursor = 'default';
						LCL.unbind(document, 'mousemove', move_Event);
						LCL.unbind(document, 'mouseup', up_Event);
					};
					if(whichIn && whichIn.length > 0) {
						LCL.bind(document, 'mousemove', move_Event);
						LCL.bind(document, 'mouseup', up_Event);
					}
				}

				// global translate
				if(LCL.enableDragCanvas && !(whichIn.length > 0)) {

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
						LCL.unbind(document, 'mousemove', move_dragCanvas);
						LCL.unbind(document, 'mouseup', up_dragCanvas);
					};

					LCL.bind(document, 'mousemove', move_dragCanvas);

					LCL.bind(document, 'mouseup', up_dragCanvas);
				}
			},

			changeOrder: function(item) {
		    var i = LCL.objects.indexOf(item);
		    var cacheData = LCL.objects[i];
		    LCL.objects.splice(i, 1);
		    LCL.objects.push(cacheData);
		    LCL._objects = LCL.reverse(LCL.objects);
		    LCL.drawUtils.redraw();
			}

		}

	})();

// Source: src/utils.js

  LCL.bind = function(target, eventType, handler) {
    if (window.addEventListener) {
      target.addEventListener(eventType, handler, false);
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, handler);
    } else {
      target['on' + eventType] = handler;
    }
    return target;
  };

  LCL.unbind = function(target, eventType, handler) {
    if (window.removeEventListener) {
      target.removeEventListener(eventType, handler, false);
    } else if (window.detachEvent) {
      target.detachEvent(eventType, handler);
    } else {
      target['on' + eventType] = '';
    }
  };

  // do not change the origin array
  LCL.reverse = function(array) {
    var length = array.length;
    var ret = [];
    for(var i = 0; i < length; i++) {
      ret[i] = array[length - i -1];
    }
    return ret;
  };

  // requestAnimationFrame polyfill
  ;(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
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
    
  }());

// Source: src/footer.js
	
	if(typeof exports === 'object' && typeof module === 'object') {
		module.exports = LCL;
	} else {
		window.LCL = LCL;
	}
})(window);