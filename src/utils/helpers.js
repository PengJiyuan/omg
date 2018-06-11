/* @flow */

export function getPos(e: MouseEvent & TouchEvent, element: HTMLElement, touchend: boolean | void): {x: number, y: number} {
  const ev = e || window.event;
  const ele = element || ev.target;
  const boundingRect = ele.getBoundingClientRect();

  let x, y;
  let touchList = touchend ? ev.changedTouches : ev.touches;
  if(isMobile()) {
    [x, y] = [touchList[0].clientX - boundingRect.left, touchList[0].clientY  - boundingRect.top];
  } else {
    x = ev.offsetX || ev.clientX;
    y = ev.offsetY || ev.clientY;
  }
  return {x, y};
}

export function bind(target: HTMLElement | Document, eventType: string, handler: Function): HTMLElement | Document {
  if (window.addEventListener) {
    target.addEventListener(eventType, handler, false);
  } else if (target.attachEvent) {
    target.attachEvent('on' + eventType, handler);
  }
  return target;
}

export function unbind(target: HTMLElement | Document, eventType: string, handler: Function): void {
  if (window.removeEventListener) {
    target.removeEventListener(eventType, handler, false);
  } else if (window.detachEvent) {
    target.detachEvent && target.detachEvent(eventType, handler);
  }
}

// do not change the origin array
export function reverse(array: Array<any>): Array<any> {
  const [ length, ret ] = [ array.length, [] ];
  for(let i = 0; i < length; i++) {
    ret[i] = array[length - i -1];
  }
  return ret;
}

export function formatFloat(f: number): number {
  const m = Math.pow(10, 10);
  return parseInt(f * m, 10) / m;
}

export function getMax(arr: Array<number>): number {
  return Math.max.apply(null, arr);
}

export function getMin(arr: Array<number>): number {
  return Math.min.apply(null, arr);
}

export function insertArray(originArray: Array<any>, start: number, number: number, insertArray: Array<any>): void {
  var args = [start, number].concat(insertArray);
  Array.prototype.splice.apply(originArray, args);
}

export function isArr(obj: any): boolean %checks {
  return !!(Object.prototype.toString.call(obj) === '[object Array]');
}

export function isObj(obj: any): boolean %checks {
  return !!(Object.prototype.toString.call(obj) === '[object Object]');
}

export function isMobile(): boolean {
  return /(iphone|ipad|ipod|ios|android|mobile|blackberry|iemobile|mqqbrowser|juc|fennec|wosbrowser|browserng|Webos|symbian|windows phone)/i.test(navigator.userAgent);
}
