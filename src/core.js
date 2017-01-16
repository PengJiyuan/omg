
  LCL = function() {

    this.version = '<%%version%%>';

    this.objects = [];

    this.canvas = null;

    this.transX = 0;

    this.transY = 0;

    this.scale = 1;

    this.drawUtils = {};

    this.loader = null; // the instance of image loader

    this.images = [];

    this.isDragging = false;

    this.eventTypes = ['mousedown', 'mouseup', 'mouseenter', 'mouseleave', 'mousemove', 'drag', 'dragend', 'dragin', 'dragout', 'drop'];

    this._event = new this.event(this);
    
    var _this = this;

    this.core = function(config) {

      if(!(config instanceof Object)) {
        console.warn('no canvas element!');
        return;
      }

      this.element = _this.element = config.element,

      this.canvas = _this.canvas =  this.element.getContext('2d');

      // init the width and height
      config.element.width = this.width = _this.width = config.width;

      config.element.height = this.height = _this.height = config.height;

      _this.enableGlobalTranslate = config.enableGlobalTranslate;

      _this.drawUtils.clear = this.clear;
      _this.drawUtils.draw = this.draw;
      _this.drawUtils.redraw = this.redraw;

      // init images
      if(config.images) {
        _this.images = config.images;
      }

    };

    this.core.prototype = {

      imgReady: function() {
        _this.loader = new _this.utils.imageLoader();
        _this.loader.addImg(_this.images);
      },

      addChild: function(obj) {
        _this.objects.push(obj);
        // copy the reverse events array
        _this._objects = _this.utils.reverse(_this.objects);
      },

      show: function() {
        this.imgReady();
        _this.loader.ready(function() {
          _this.drawUtils.draw();
          _this._event.triggerEvents();
        });
      },

      draw: function() {
        _this.objects.forEach(function(item) {
          item.draw();
        });
      },

      redraw: function() {
        _this.drawUtils.clear();
        _this.canvas.save();
        _this.canvas.translate(_this.transX, _this.transY);
        _this.drawUtils.draw();
        _this.canvas.restore();
      },

      clear: function() {
        _this.canvas.clearRect(0, 0, _this.width, _this.height);
      },

      animate: function(func, name) {
        _this._event.triggerEvents();
        var id = new Date().getTime();
        var _func = function() {
          func();
          _this[id] = requestAnimationFrame(_func);
        }
        _func();
        return id;
      },

      stop: function(id) {
        cancelAnimationFrame(_this[id]);
      },

      globalTranslate: function(bool) {
        if(typeof bool !== 'boolean' || !bool) {
          return;
        }
        _this.enableGlobalTranslate = true;
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

    };

    this.init = function(config) {
      return new _this.core(config);
    };

  };

