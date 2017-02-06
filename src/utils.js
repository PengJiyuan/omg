  
  LCL.prototype.utils = {};

  LCL.prototype.utils.bind = function(target, eventType, handler) {
    try {
      if (window.addEventListener) {
        target.addEventListener(eventType, handler, false);
      } else if (target.attachEvent) {
        target.attachEvent('on' + eventType, handler);
      } else {
        target['on' + eventType] = handler;
      }
      return target;
    } catch(e) {}
  };

  LCL.prototype.utils.unbind = function(target, eventType, handler) {
    try {
      if (window.removeEventListener) {
        target.removeEventListener(eventType, handler, false);
      } else if (window.detachEvent) {
        target.detachEvent(eventType, handler);
      } else {
        target['on' + eventType] = '';
      }
    } catch(e) {}
  };

  // do not change the origin array
  LCL.prototype.utils.reverse = function(array) {
    var length = array.length;
    var ret = [];
    for(var i = 0; i < length; i++) {
      ret[i] = array[length - i -1];
    }
    return ret;
  };

  LCL.prototype.utils.imageLoader = function() {
    this.imageList = new Array();
    this.loadNum = 0;
  };

  LCL.prototype.utils.imageLoader.prototype = {

    ready: function(callback) {
      var that = this;
      this.imageList.forEach(function(img){  
        that.loadImg(img);  
      });
      var timer = setInterval(function(){
        if(that.loadNum === that.imageList.length){
          clearInterval(timer);
          callback && callback();
        }  
      }, 50);
    },

    loadImg: function(img) {
      var that = this;
      var timer = setInterval(function(){  
        if(img.complete === true){
          that.loadNum++;  
          clearInterval(timer);  
        }  
      }, 50);
    },

    addImg: function(imageArray) {
      var that = this;
      imageArray.forEach(function(src) {
        var img = new Image();
        img.src = src;
        img.name = src;
        img.loaded = false;
        that.imageList.push(img);
      });
    },

    getImg: function(name) {
      var target;
      this.imageList.forEach(function(img){
        if(img.name == name){
          target = img;
        }
      });
      return target;
    }

  };

  LCL.prototype.utils.calculateCoord = function(max, min) {
    var gap, // return value -> gap
      retMax, // return value -> max
      absMax, // absolute value -> max
      calcMax, // converted max
      numLength; // max value length
    var ma = Math.abs(max), mi = Math.abs(min);
    absMax = ma >= mi ? ma : mi;
    numLength = absMax < 1 ? absMax.toString().length : absMax.toString().length;
    calcMax = absMax < 1 ? this.formatFloat( absMax * Math.pow(10, numLength - 2), 1 ) : ( absMax / Math.pow(10, numLength - 1) );
    if(calcMax === 1 && numLength > 1) {
      calcMax = 10;
      numLength --;
    } else if(calcMax > 10) {
      var l = calcMax.toString().length
      calcMax = calcMax / Math.pow(10, l - 1);
      numLength = numLength - l + 1;
    }

    var data = [
      [1, 0.2],
      [1.2, 0.2],
      [1.4, 0.2],
      [1.5, 0.3],
      [1.8, 0.3],
      [2, 0.4],
      [2.5, 0.5],
      [3, 0.5],
      [3.5, 0.5],
      [4, 0.5],
      [5, 1],
      [6, 1],
      [7, 1],
      [8, 1],
      [10, 2]
    ];

    data.forEach(function(item, index) {
      var pre = index === 0 ? 0 : data[index - 1][0];
      if(pre < calcMax && calcMax <= item[0]) {
        gap = item[1],
        retMax = item[0];
      }
    });

    return {
      gap: absMax < 1 ? ( gap / Math.pow(10, numLength - 2) ) :  ( gap * Math.pow(10, numLength - 1) ),
      max: absMax < 1 ? ( retMax / Math.pow(10, numLength - 2) ) : ( retMax * Math.pow(10, numLength - 1) )
    };

  };

  // adjustment accuracy
  LCL.prototype.utils.formatFloat = function(f, digit) { 
    var m = Math.pow(10, digit); 
    return parseInt(f * m, 10) / m;
  }

  // requestAnimationFrame polyfill
  ;(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    try {
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
    } catch(e) {}

  }());