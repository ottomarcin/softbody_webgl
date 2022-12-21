import Time from './Time';

export default class TimePausable extends Time {
  constructor() {
    super();
    this.paused = false;
    this.on('tick', () => {
      if (!this.paused) {
        this.pausableDelta = this.delta;
      } else {
        this.pausableDelta = 0;
      }
    });
  }
  togglePause = () => {
    this.paused = !this.paused;
  };
}
