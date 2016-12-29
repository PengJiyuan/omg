
	var LCL = {

		version: '<%%version%%>',

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