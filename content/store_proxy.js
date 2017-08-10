'use strict';

class StoreProxy extends Proxy {
  static get ACTION_ADD_TO_OPERA() { return 'add-to-opera'; }
  static get APIs() {
    return super.APIs.concat([
      'chrome.management',
      'chrome.webstorePrivate',
    ]);
  }

  constructor() {
    super();
    chrome.runtime.onMessage.addListener(action => this.onMessage_(action));
  }

  static get SCRIPTS() {
    return super.SCRIPTS.concat([
      '/api/app.js',
      '/content/inject/store_page.js',
    ]);
  }

  dispatchAddToOpera_() {
    try {
      const buttonLabel = document.querySelector(
          '[role=dialog] [role=button] .webstore-test-button-label');
      const button = buttonLabel.closest('[role=button]');
      button.click();
    } catch (e) {
      // if any error then wait for fallback
    }
  }

  onMessage_(action) {
    if (action === this.constructor.ACTION_ADD_TO_OPERA) {
      this.dispatchAddToOpera_();
    }
  }
}

new StoreProxy();
