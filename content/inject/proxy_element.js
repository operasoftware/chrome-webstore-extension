class ProxyElement extends HTMLElement {
  static get ELEMENT_NAME() { return ID; }
  static get EVENT_API_DEF() { return 'api-def'; }
  static get EVENT_API_RESPONSE() { return 'api-response'; }
  static get EVENT_MESSAGE() { return 'message'; }
  createdCallback() {
    this.callbacks_ = new CallbackRegistry();
    this.addEventListener(
        this.constructor.EVENT_API_DEF, e => this.build_(e.detail));
    this.addEventListener(
        this.constructor.EVENT_API_RESPONSE, e => this.response_(e.detail));
  }

  createEvent_(path) {
    let pid;
    return Event.get({
      addListener: callback => {
        pid = this.callbacks_.add(data => {
          if (callback) {
            callback(...data);
          }
        }, true);

        this.dispatchEvent(new CustomEvent(this.constructor.EVENT_MESSAGE, {
          detail: {
            id: pid,
            add: `${path}.addListener`,
            remove: `${path}.removeListener`,
          },
        }));
      },

      removeListener: () => {
        if (pid) {
          this.callbacks_.remove(pid);
        }
      },
    });
  }

  createMethod_(path) {
    return function() {
      let callback = null;
      let data = Array.from(arguments);
      if (data[data.length - 1] instanceof Function) {
        callback = data.pop();
      }

      let id = this.callbacks_.add(data => {
        if (callback) {
          callback(...data);
        }
      }, false);

      this.dispatchEvent(new CustomEvent(this.constructor.EVENT_MESSAGE, {
        detail: {
          type: path,
          data: data,
          isSync: !Boolean(callback),
          id: id,
        },
      }));
    }.bind(this);
  }

  response_({id, data}) {
    if (id) {
      this.callbacks_.exec(id, data);
    }
  }

  build_(def) {
    let path = def.name.split('.');
    let api = window;

    while (path.length) {
      let obj = path.shift();
      api[obj] = api[obj] || {};
      api = api[obj];
    }

    for (let item of def.data) {
      if (item.type === Api.TYPE_OBJECT) {
        api[item.name] = item.value;
      } else if (item.type === Api.TYPE_FUNCTION) {
        api[item.name] = this.createMethod_(`${def.name}.${item.name}`);
      } else if (item.type === Api.TYPE_EVENT) {
        api[item.name] = this.createEvent_(`${def.name}.${item.name}`);
      }
    }
  }
}

document.registerElement(ProxyElement.ELEMENT_NAME, ProxyElement);
