import Time from './time.js';

export default class Timer {
  constructor () {
    this._messageTimes = [];
    this._sortTime = 0;
    this._pauseTime = 0;
    this._timeElapsed = 0;
  }

  startSortTimer () {
    this._sortTime = new Time(0, performance.now());
  }

  stopSortTimer () {
    this._sortTime.end = performance.now();
  }

  startMessageTimer (id) {
    this._messageTimes.push(new Time(id, performance.now()));
  }

  stopMessageTimer (id) {
    const message = this._messageTimes.find(o => o.id === id);
    message.end = performance.now();
  }

  getFullDuration () {
    return this._sortTime.getDuration() - this._timeElapsed;
  }

  getSortDuration () {
    return this.getFullDuration() - this._timeElapsed;
  }

  getMessageDurations () {
    return this._messageTimes.map((e) => e.getDuration());
  }

  getMessagesTimeSum () {
    return this.getMessageDurations().reduce((a, b) => a + b, 0);
  }

  getMessageTimesAverage () {
    return this.getMessagesTimeSum() / this._messageTimes.length;
  }

  tasksAreCompleted () {
    return !this._messageTimes.some(e => (e.end === 0));
  }

  pauseSortTimer () {
    this._pauseTime = performance.now();
  }

  resumeSortTimer () {
    if (this._pauseTime !== 0) {
      this._timeElapsed = this._timeElapsed + performance.now() - this._pauseTime;
      this._pauseTime = 0;
    }
  }
}
