
  var LCL = {

    version: '<%%version%%>',

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