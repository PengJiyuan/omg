
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

  calculateCoord(max, min) {
    let gap, // return value -> gap
      retMax, // return value -> max
      absMax, // absolute value -> max
      calcMax, // converted max
      numLength; // max value length
    const [ ma, mi ] = [ Math.abs(max), Math.abs(min) ];
    absMax = ma >= mi ? ma : mi;
    numLength = absMax < 1 ? absMax.toString().length : absMax.toString().length;
    calcMax = absMax < 1 ? this.formatFloat( absMax * Math.pow(10, numLength - 2), 1 ) : ( absMax / Math.pow(10, numLength - 1) );
    if(calcMax === 1 && numLength > 1) {
      calcMax = 10;
      numLength --;
    } else if(calcMax > 10) {
      const l = calcMax.toString().length;
      calcMax = calcMax / Math.pow(10, l - 1);
      numLength = numLength - l + 1;
    }

    const granularity = [
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

    granularity.forEach((item, index) => {
      const pre = index === 0 ? 0 : granularity[index - 1][0];
      if(pre < calcMax && calcMax <= item[0]) {
        gap = item[1],
        retMax = item[0];
      }
    });

    return {
      gap: absMax < 1 ? ( gap / Math.pow(10, numLength - 2) ) :  ( gap * Math.pow(10, numLength - 1) ),
      max: absMax < 1 ? ( retMax / Math.pow(10, numLength - 2) ) : ( retMax * Math.pow(10, numLength - 1) )
    };
  },

  formatFloat(f) {
    const m = Math.pow(10, 10);
    return parseInt(f * m, 10) / m;
  },

  getMaxMin(isX, series, xAxis) {
    let max, min, maxArray = [], minArray = [];
    series.forEach(item => {
      let ma = [];
      item.data.forEach(i => {
        if(isX) {
          ma.push(i[0]);
        } else {
          xAxis.data && xAxis.data.length > 0 ? ma.push(i) : ma.push(i[1]);
        }
      });
      maxArray.push(Math.max.apply(null, ma));
      minArray.push(Math.min.apply(null, ma));
    });
    max = Math.max.apply(null, maxArray);
    min = Math.min.apply(null, minArray);

    return { max, min };
  },

  isArr(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

};
