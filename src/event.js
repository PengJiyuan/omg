
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