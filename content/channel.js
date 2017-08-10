'use strict';

class Channel {
  constructor() {
    this.callbacks_ = new CallbackRegistry();
    this.port_ = chrome.runtime.connect();
    this.port_.onMessage.addListener(message => this.onMessage_(message));
  }

  fetch() { return this.send('fetch', Array.from(arguments)); }

  forward(message, callback) {
    let id = message.id;
    let isPersistent = this.callbacks_.isPersistent(id);
    message.id =
        this.callbacks_.add(data => callback({id, data}), isPersistent);

    this.port_.postMessage(message);
  }

  send(type, data, isSync) {
    return new Promise(resolve => {
      let message = {};
      message.data = data;
      message.type = type;
      message.isSync = isSync;
      message.id = this.callbacks_.add(data => resolve(data), false);
      this.port_.postMessage(message);
    });
  }

  onMessage_(message) { this.callbacks_.exec(message.id, message.data); }
}
