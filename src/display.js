
  LCL.prototype.display = function(settings) {

    var _this = this;

    var settingsData = {

      color: settings.color, // arc

      startX: settings.startX,

      startY: settings.startY,

      dash: settings.dash, // line

      offset: settings.offset ? settings.offset : 0, // line

      fillColor: settings.fillColor, // rectangle fillcolor

      sliceX: settings.sliceX, // image sliceX

      sliceY: settings.sliceY, // image sliceY

      width: settings.width, // image

      height: settings.height, // image

      sliceWidth: settings.sliceWidth, // image

      sliceHeight: settings.sliceHeight, // image

      backgroundColor: settings.backgroundColor, //text

      text: settings.text, // text,

      radius: settings.radius //arc

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
        if(~_this.eventTypes.indexOf(event)) {
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

      var ltx = this.fixed ? 0 : _this.transX;
      var lty = this.fixed ? 0 : _this.transY;
      var mx = this.moveX,
        my = this.moveY;
      // rotate the x and y coordinates
      // var cX = this.startX + this.width/2 + ltx + this.moveX, cY = this.startY + this.height/2 + lty + this.moveY;
      // var oX = (x - cX)*Math.cos((Math.PI/180)*(-this.rotate)) - (y - cY)*Math.sin((Math.PI/180)*(-this.rotate)) + cX;
      // var oY = (x - cX)*Math.sin((Math.PI/180)*(-this.rotate)) + (y - cY)*Math.cos((Math.PI/180)*(-this.rotate)) + cY;
      // var xRight = oX > this.startX + ltx+ this.moveX;
      // var xLeft = oX < this.startX + this.width + ltx+ this.moveX;
      // var yTop = oY > this.startY + lty + this.moveY;
      // var yBottom = oY < this.startY + this.height + lty + this.moveY;
      var xRight = x > this.startX + mx + ltx;
      var xLeft = x < this.startX + this.width + mx + ltx;
      var yTop = y > this.startY + my + lty;
      var yBottom = y < this.startY + this.height + my + lty;

      switch(this.type) {

      case 'rectangle':
      case 'image':
      case 'text':
      case 'coord':
        return !!(xRight && xLeft && yTop && yBottom);
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
      default:
        break;
      }

      // expand isPointerInner
      var arr = _this.pointerInnerArray;
      for(var i = 0; i < arr.length; i++) {
        if(that.type === arr[i].type) {
          return arr[i].isPointInner(that, x, y);
        }
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
      this.zindex = obj.zindex ? obj.zindex : 0;
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

    return Object.assign({}, settingsData, {

      isDragging: false,

      hasEnter: false,

      hasDraggedIn: false,

      moveX: 0,

      moveY: 0,

      on: on,

      isPointInner: isPointInner,

      config: config,

      drag: drag,

      changeIndex: changeIndex

    });

  };
