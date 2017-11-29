import * as easing from './easing';

export class Tween {
  constructor(settings) {
    const {
      from,
      to,
      duration,
      delay,
      easing,
      onUpdate,
      onFinish
    } = settings;

    for(let key in from) {
      if(to[key] === undefined) {
        to[key] = from[key];
      }
    }
    for(let key in to) {
      if(from[key] === undefined) {
        from[key] = to[key];
      }
    }

    this.from = from;
    this.to = to;
    this.duration = duration || 500;
    this.delay = delay || 0;
    this.easing = easing || 'linear';
    this.onUpdate = onUpdate || function() {};
    this.onFinish = onFinish || function() {};
    this.startTime = Date.now() + this.delay;
    this.finished = false;
    this.keys = {};
  }

  update() {
    if(this.elapsed === this.duration) {
      if(!this.finished) {
        this.onFinish(this.keys);
        this.finished = true;
      }
      return;
    }
    this.time = this.time ? Date.now() : this.startTime;
    this.elapsed = this.time - this.startTime;
    this.elapsed = this.elapsed > this.duration ? this.duration : this.elapsed;
    for(let key in this.to) {
      this.keys[key] = this.from[key] + ( this.to[key] - this.from[key] ) * easing[this.easing](this.elapsed / this.duration);
    }
    this.onUpdate(this.keys);
  }
}
