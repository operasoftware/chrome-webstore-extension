'use strict';

class ContentProxy {
  constructor(chromeWhitelist, operaWhitelist) {
    this.opr_ = operaWhitelist || {};
    this.chrome_ = chromeWhitelist || {};

    this.listeners_ = new Map();

    chrome.runtime.onConnect.addListener(port => this.onConnect_(port));
  }

  get opr() { return this.opr_; }
  get chrome() { return this.chrome_; }

  addListener_(port, message) {
    let id = message.id;
    let add = this.getMethod_(message.add);
    if (!add) {
      return;
    }

    let listener = (...data) => port.postMessage({data, id});
    add(listener);

    if (!message.remove) {
      return;
    }
    let remove = this.getMethod_(message.remove);
    if (!remove) {
      return;
    }

    if (!this.listeners_.has(port)) {
      this.listeners_.set(port, []);
    }

    let listeners = this.listeners_.get(port);
    listeners.push(() => remove(listener));
  }

  callMethod_(port, message) {
    let id = message.id;
    let method = this.getMethod_(message.type);
    let callback = data => port.postMessage({data, id});

    if (!method) {
      callback();
      return;
    }

    let args = message.data;
    try {
      if (message.isSync) {
        callback([method(...args)]);
      } else {
        args.push((...data) => callback(data));
        method(...args);
      }
    } catch (e) {
      callback();
    }
  }

  fetch(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => callback(xhr.response);
    xhr.open('GET', chrome.extension.getURL(url));
    xhr.send();
  }

  getDefinition(name, callback) {
    let api = this;
    let defs;
    let path = name.split('.');

    try {
      while (path.length) {
        api = api[path.shift()];
      }

      if (api.constructor.name !== 'Object') {
        if (api.constructor.name === 'Function') {
          defs = api.prototype;
        } else {
          defs = Object.getPrototypeOf(api);
        }
      } else {
        defs = api;
      }

      let items = Object.getOwnPropertyNames(defs)
                      .map(name => {
                        let data = {name};
                        let item = api[name];
                        data.type = this.getType_(item);

                        if (data.type === Api.TYPE_OBJECT) {
                          data.value = Object.assign({}, item);
                        }
                        return data;
                      })
                      .filter(entry => entry !== null);
      callback(items);
    } catch (e) {
      callback([]);
    }
  }

  getMethod_(path) {
    path = path.split('.');
    let root = this;
    let method = root;
    try {
      while (path.length) {
        root = method;
        method = root[path.shift()];
      }

      return method.bind(root);
    } catch (e) {
      return null;
    }
  }

  getType_(item) {
    if (item.constructor.name.toLowerCase().endsWith('event')) {
      return Api.TYPE_EVENT;
    }
    if (item instanceof Function) {
      return Api.TYPE_FUNCTION;
    }
    if (item instanceof Object) {
      return Api.TYPE_OBJECT;
    }
  }

  onConnect_(port) {
    port.onDisconnect.addListener(() => {
      let listeners = this.listeners_.get(port) || [];
      for (let listener of listeners) {
        listener();
      }
      this.listeners_.delete(port);
    });
    port.onMessage.addListener(message => this.onMessage_(port, message));
  }

  onMessage_(port, message) {
    if (String(message.id).startsWith('_')) {
      this.addListener_(port, message);
    } else {
      this.callMethod_(port, message);
    }
  }
}
