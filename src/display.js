
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

