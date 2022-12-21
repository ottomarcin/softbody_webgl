import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.elapsedTime = 0;
    this.delta = 16;
    requestAnimationFrame(() => this.tick());
  }
  tick = () => {
    const current = Date.now();
    this.delta = current - this.current;
    this.current = current;
    this.elapsedTime = this.current - this.start;
    this.trigger('tick');
    requestAnimationFrame(() => this.tick());
  };
}
