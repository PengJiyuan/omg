
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