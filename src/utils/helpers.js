
export default {

  getPos(e) {
    const ev = e || event;
    const [ x, y ] = [ ev.pageX, ev.pageY ];
    return {x, y};
  },

  bind(target, eventType, handler) {
    if (window.addEventListener) {
      target.addEventListener(eventType, handler, false);
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, handler);
    } else {
      target['on' + eventType] = handler;
    }
    return target;
  },

  unbind(target, eventType, handler) {
    if (window.removeEventListener) {
      target.removeEventListener(eventType, handler, false);
    } else if (window.detachEvent) {
      target.detachEvent(eventType, handler);
    } else {
      target['on' + eventType] = '';
    }
  },

  // do not change the origin array
  reverse(array) {
    const [ length, ret ] = [ array.length, [] ];
    for(let i = 0; i < length; i++) {
      ret[i] = array[length - i -1];
    }
    return ret;
  },

  formatFloat(f) {
    const m = Math.pow(10, 10);
    return parseInt(f * m, 10) / m;
  },

  /**
   * @param {Array} arr
   */
  getMax(arr) {
    return Math.max.apply(null, arr);
  },
  /**
   * @param {Array} arr
   */
  getMin(arr) {
    return Math.min.apply(null, arr);
  },

  insertArray(originArray, start, number, insertArray) {
    var args = [start, number].concat(insertArray);
    Array.prototype.splice.apply(originArray, args);
  },

  isArr(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  },

  isObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

};
