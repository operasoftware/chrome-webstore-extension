'use strict';

{
  const WEBSTORE_HOST_PATTERN = '*://*.chrome.google.com/*';
  const YANDEX_UA_CODE = 'YaBrowser';
  const YANDEX_ERROR_MESSAGE = 'welcomeYandex';

  class EventPageExtension {
    constructor() {
      if (!this.isSupportedBrowser_()) {
        chrome.management.uninstallSelf();
        return;
      }

      this.registerListeners_();
    }

    isSupportedBrowser_() {
      if (navigator.userAgent.includes(YANDEX_UA_CODE)) {
        alert(chrome.i18n.getMessage(YANDEX_ERROR_MESSAGE));
        return false;
      }
      return true;
    }

    registerListeners_() {
      chrome.runtime.onConnect.addListener(port => this.createProxy_(port));
      chrome.runtime.onInstalled.addListener(({reason}) => {
        const {INSTALL, UPDATE} = chrome.runtime.OnInstalledReason;
        if (reason === INSTALL || reason === UPDATE) {
          this.reloadWebstoreTabs_();
        }
      });
    }

    createProxy_(port) {
      const installer = Installer.get();
      const management = Management.get();
      const webstorePrivate = WebstorePrivate.get(installer);

      new ContentProxy(port, installer, {management, webstorePrivate});
    }

    reloadWebstoreTabs_() {
      chrome.tabs.query({url: WEBSTORE_HOST_PATTERN}, tabs => {
        for (let {id} of tabs) {
          chrome.tabs.reload(id);
        }
      });
    }
  }

  new EventPageExtension();
}
