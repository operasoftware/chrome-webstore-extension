'use strict';

class CallbackRegistry {
  constructor() {
    this.normalCallbacks_ = new Map();
    this.normalLastID_ = 0;
    this.persistentCallbacks_ = new Map();
    this.persistentlLastID_ = 0;
  }

  add(callback, isPersistent) {
    let id;
    if (isPersistent) {
      id = this.persistentlLastID_++ % 1000000;
      id = `_${id}`;
      this.persistentCallbacks_.set(id, data => callback(data));
    } else {
      id = this.normalLastID_++ % 1000000;
      this.normalCallbacks_.set(id, data => callback(data));
    }

    return id;
  }

  exec(id, data) {
    if (this.isPersistent(id)) {
      if (this.persistentCallbacks_.has(id)) {
        this.persistentCallbacks_.get(id)(data);
      }
    } else {
      if (this.normalCallbacks_.has(id)) {
        this.normalCallbacks_.get(id)(data);
        this.remove(id);
      }
    }
  }

  remove(id) {
    if (this.isPersistent(id)) {
      this.persistentCallbacks_.delete(id);
    } else {
      this.normalCallbacks_.delete(id);
    }
  }

  isPersistent(id) { return String(id).startsWith('_'); }
}
