'use strict';

class ContentProxy {
  static get ACTION_ADD_TO_OPERA() { return 'add-to-opera'; }

  constructor(port, installer, chromeWhitelist, operaWhitelist) {
    this.port_ = port;
    const tab = this.port_.sender.tab;
    this.tabId_ = tab.id;
    this.installer_ = installer;
    this.opr_ = operaWhitelist || {};
    this.chrome_ = chromeWhitelist || {};

    this.registeredListeners_ = [];
    this.registerPortListeners_();
    this.onTabUpdate_(tab);
  }

  get opr() { return this.opr_; }
  get chrome() { return this.chrome_; }

  registerPortListeners_() {
    const onDisconnect = () => {
      for (let listener of this.registeredListeners_) {
        listener();
      }
    };
    this.port_.onDisconnect.addListener(onDisconnect);
    this.callOnDisconnect_(
        () => this.port_.onDisconnect.removeListener(onDisconnect));

    const onMessage = message => this.onMessage_(message);
    this.port_.onMessage.addListener(onMessage);
    this.callOnDisconnect_(
        () => this.port_.onMessage.removeListener(onMessage));

    const onActivated = info => {
      chrome.tabs.get(info.tabId, tab => this.onTabUpdate_(tab));
    };
    chrome.tabs.onActivated.addListener(onActivated);
    this.callOnDisconnect_(
      () => chrome.tabs.onActivated.removeListener(onActivated));

    const onUpdated = (id, changes, tab) => this.onTabUpdate_(tab);
    chrome.tabs.onUpdated.addListener(onUpdated);
    this.callOnDisconnect_(
        () => chrome.tabs.onUpdated.removeListener(onUpdated));

    const onClicked = tab => {
      if (!tab || tab.id !== this.tabId_ || !tab.url) {
        return;
      }
      this.onButtonClicked_(tab.url);
    };
    chrome.pageAction.onClicked.addListener(onClicked);
    this.callOnDisconnect_(
        () => chrome.pageAction.onClicked.removeListener(onClicked));
  }

  callOnDisconnect_(method) { this.registeredListeners_.push(method); }

  addListener_(message) {
    const id = message.id;
    const add = this.getMethod_(message.add);
    if (!add) {
      return;
    }

    const listener = (...data) => this.port_.postMessage({data, id});
    add(listener);

    if (!message.remove) {
      return;
    }
    const remove = this.getMethod_(message.remove);
    if (!remove) {
      return;
    }

    this.callOnDisconnect_(() => remove(listener));
  }

  setButtonVisibility_(isVisible) {
    if (isVisible) {
      chrome.pageAction.show(this.tabId_);
    } else {
      chrome.pageAction.hide(this.tabId_);
    }
  }

  callMethod_(message) {
    const id = message.id;
    const method = this.getMethod_(message.type);
    const callback = data => this.port_.postMessage({data, id});

    if (!method) {
      callback();
      return;
    }

    const args = message.data;
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
    const xhr = new XMLHttpRequest();
    xhr.onload = () => callback(xhr.response);
    xhr.open('GET', chrome.extension.getURL(url));
    xhr.send();
  }

  getDefinition(name, callback) {
    let api = this;
    let defs;
    const path = name.split('.');

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

      const items = Object.getOwnPropertyNames(defs).map(name => {
        const data = {name};
        const item = api[name];
        data.type = this.getType_(item);

        if (data.type === Api.TYPE_OBJECT) {
          data.value = Object.assign({}, item);
        }
        return data;
      }).filter(entry => entry !== null);

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

  onMessage_(message) {
    const {id} = message;
    if (String(id).startsWith('_')) {
      this.addListener_(message);
    } else {
      this.callMethod_(message);
    }
  }

  onTabUpdate_(tab) {
    if (!tab || tab.id !== this.tabId_) {
      return;
    }
    const url = tab.url;
    const isDetailsPage =
        url && url.includes('chrome.google.com/webstore/detail/');
    this.setButtonVisibility_(isDetailsPage);
  }

  onButtonClicked_(url) {
    const id = this.installer_.getIdFromUrl(url);
    if (!id) {
      return;
    }

    this.installer_.isInstalled(id).then(isInstalled => {
      this.setButtonVisibility_(false);
      if (isInstalled) {
        this.installer_.navigateToExtensionDetails(id);
        return;
      }

      let onInstallRequest;
      new Promise((resolve, reject) => {
        onInstallRequest = extensionId => {
          if (id === extensionId) {
            resolve();
          }
        };
        this.installer_.onInstallRequest.addListener(onInstallRequest);
        chrome.tabs.sendMessage(
            this.tabId_, this.constructor.ACTION_ADD_TO_OPERA);
        setTimeout(reject, 3000);
      }).then(() => {
        this.installer_.onInstallRequest.removeListener(onInstallRequest);
      }).catch(() => {
        this.installer_.onInstallRequest.removeListener(onInstallRequest);
        this.installer_.install({id});
      });
    });
  }
}
