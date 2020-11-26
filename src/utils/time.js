class Time {
  constructor (id, start, end = 0) {
    this._id = id;
    this._start = start;
    this._end = end;
  }

  get id () {
    return this._id;
  }

  get start () {
    return this._start;
  }

  get end () {
    return this._end;
  }

  set end (value) {
    this._end = value;
  }

  getDuration () {
    return this._end - this._start;
  }
}

export default Time;
