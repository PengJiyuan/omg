
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