'use strict';

class Management extends Api {
  static get UPDATE_URL() { return 'clients2.google.com'; }

  constructor() {
    super();
    this.api_ = chrome.management;
    this.onDisabled_ = Event.get(this.api_.onDisabled);
    this.onEnabled_ = Event.get(this.api_.onEnabled);
    this.onInstalled_ = Event.get(this.api_.onInstalled);
    this.onUninstalled_ = Event.get(this.api_.onUninstalled);
  }

  get ExtensionDisabledReason() { return this.api_.ExtensionDisabledReason; }
  get ExtensionInstallType() { return this.api_.ExtensionInstallType; }
  get ExtensionType() { return this.api_.ExtensionType; }
  get LaunchType() { return this.api_.LaunchType; }
  get onDisabled() { return this.onDisabled_; }
  get onEnabled() { return this.onEnabled_; }
  get onInstalled() { return this.onInstalled_; }
  get onUninstalled() { return this.onUninstalled_; }

  isFromStore_(item) {
    return item && item.updateUrl &&
        item.updateUrl.indexOf(this.constructor.UPDATE_URL) !== -1;
  }

  createAppShortcut() { return this.api_.createAppShortcut(...arguments); }
  generateAppForLink() { return this.api_.generateAppForLink(...arguments); }

  get(id, callback = () => {}) {
    return this.api_.get(
        id, item => { callback(this.isFromStore_(item) ? item : null); });
  }

  getAll(callback = () => {}) {
    return this.api_.getAll(
        items => { callback(items.filter(item => this.isFromStore_(item))); });
  }

  getPermissionWarningsById(id, callback = () => {}) {
    this.get(id, item => {
      if (!item) {
        callback([]);
      } else {
        this.api_.getPermissionWarningsById(...arguments);
      }
    });
  }

  launchApp() { return this.api_.launchApp(...arguments); }

  setEnabled(id, enabled, callback = () => {}) {
    this.get(id, item => {
      if (!item) {
        callback();
      } else {
        this.api_.setEnabled(...arguments);
      }
    });
  }

  setLaunchType() { return this.api_.setLaunchType(...arguments); }

  uninstall(id) {
    let args = Array.from(arguments);
    let callback = () => {};
    if (args[args.length - 1] instanceof Function) {
      callback = args[args.length - 1];
    }

    this.get(id, item => {
      if (!item) {
        callback();
      } else {
        this.api_.uninstall(...arguments);
      }
    });
  }
}
