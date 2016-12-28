
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
			var that = this;
			var down_dragCanvas = function(e_down) {
				that.cacheX = LCL.event.getPos(e_down).x;
				that.cacheY = LCL.event.getPos(e_down).y;

				LCL.bind(document, 'mousemove', move_dragCanvas);

				LCL.bind(document, 'mouseup', up_dragCanvas);
			};

			var move_dragCanvas = function(e_move) {
				var mx = LCL.event.getPos(e_move).x,
					my = LCL.event.getPos(e_move).y;
				LCL.transX = LCL.transX + mx - that.cacheX;
				LCL.transY = LCL.transY + my - that.cacheY;
				that.redraw();
				that.cacheX = mx;
				that.cacheY = my;
			};

			var up_dragCanvas = function() {
				LCL.unbind(document, 'mousemove', move_dragCanvas);
				LCL.unbind(document, 'mouseup', up_dragCanvas);
			};

			LCL.bind(LCL.element, 'mousedown', down_dragCanvas);
		},

		scaleCanvas: function(bool) {
			if(typeof bool !== 'boolean' || !bool) {
				return;
			}
			var that = this;
			LCL.bind(this.element, 'wheel', function(e) {
				if(e.deltaY < 0) {
					if(LCL.scale <= 3) {
						LCL.scale += 0.02;
						that.redraw();
					}
				} else {
					if(LCL.scale > 0.5) {
						LCL.scale -= 0.02;
						that.redraw();
					}
				}
			});
		}

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

		var isPointInner = function(x, y) {
			var that = this;
			var xRight = x > that.startX*LCL.scale + LCL.transX + this.moveX;
			var xLeft = x < (that.startX + that.width)*LCL.scale + LCL.transX + this.moveX;
			var yTop = y > that.startY*LCL.scale + LCL.transY + this.moveY;
			var yBottom = y < (that.startY + that.height)*LCL.scale + LCL.transY + this.moveY;

			switch(this.type) {
				case 'rectangle':
					return !!(xRight && xLeft && yTop && yBottom);
			}
		};

		var drag = function(bool) {
			if(!bool || typeof bool !== 'boolean') {
				return;
			}
			this.enableDrag = true;
		}

		return Object.assign({}, settingsData, {

			hasEnter: false,

			rotate: 0,

			moveX: 0,

			moveY: 0,

			events: this.events,

			on: on,

			isPointInner: isPointInner,

			drag: drag

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
				canvas.translate(startX + width/2 + this.moveX, startY + height/2 + this.moveY);
				canvas.rotate((Math.PI/180)*this.rotate);
				canvas.translate(-(startX + width/2 + this.moveX), -(startY + height/2 + this.moveY));
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
				var that = this;
				var hasEvents = LCL.objects.some(function(item) {
					return !!item.events && Object.prototype.toString.call(item.events) === '[object Array]';
				});
				var hasDrags = LCL.objects.some(function(item) {
					return !!item.enableDrag;
				});
				if(!hasEvents) {
					return;
				}

				var hasEnterOrMove = LCL.objects.some(function(item) {
					return item.events && item.events.some(function(i) {
						return i.eventType === 'mouseenter' || i.eventType === 'mousemove';
					});
				});

				if(hasEnterOrMove) {
					LCL.bind(LCL.element, 'mousemove', function(e_moveOrEnter) {
						var mX = LCL.event.getPos(e_moveOrEnter).x;
						var mY = LCL.event.getPos(e_moveOrEnter).y;
						LCL.objects.filter(function(item) {
							return item.events && item.events.some(function(i) {
								return i.eventType === 'mouseenter' || i.eventType === 'mousemove';
							});
						}).forEach(function(item) {
							if(item.isPointInner(mX, mY)) {
								item.hasEnter = true;
								item.events.forEach(function(i) {
									if(i.eventType === 'mouseenter' || i.eventType === 'mousemove') {
										i.callback && i.callback();
									}
								});
							} else {
								item.hasEnter && item.events.forEach(function(i) {
									if(i.eventType === 'mouseleave') {
										i.callback && i.callback();
									}
								});
								item.hasEnter = false;
							}
						});
					});
				}

				var down_dragCanvas = function(e_down) {
					var pX = LCL.event.getPos(e_down).x;
					var pY = LCL.event.getPos(e_down).y;
					that.cacheX = pX;
					that.cacheY = pY;
					LCL.objects.filter(function(item) {
						return !!item.events && Object.prototype.toString.call(item.events) === '[object Array]';
					}).some(function(item) {
						return item.isPointInner(pX, pY) && item.events[0].callback && item.events[0].callback();
					});

					LCL.objects.filter(function(item) {
						return !!item.enableDrag;
					}).forEach(function(item) {
						var move_dragCanvas = function(e_move) {
							var mx = LCL.event.getPos(e_move).x,
								my = LCL.event.getPos(e_move).y;
							if(!item.isPointInner(mx, my)) {
								return;
							}
							LCL.element.style.cursor = 'pointer';
							item.moveX = item.moveX + mx - that.cacheX;
							item.moveY = item.moveY + my - that.cacheY;
							LCL.drawUtils.redraw();
							that.cacheX = mx;
							that.cacheY = my;
						};

						var up_dragCanvas = function() {
							LCL.element.style.cursor = 'default';
							LCL.unbind(document, 'mousemove', move_dragCanvas);
							LCL.unbind(document, 'mouseup', up_dragCanvas);
						};

						LCL.bind(document, 'mousemove', move_dragCanvas);
						LCL.bind(document, 'mouseup', up_dragCanvas);
					});
				};

				LCL.bind(LCL.element, 'mousedown', down_dragCanvas);
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