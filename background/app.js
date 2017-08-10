'use strict';

class App {
  static get ACTION_ADD_TO_OPERA() { return 'add-to-opera'; }
  static get CRX_HOST_PATTERN() { return '*://clients2.google.com/*'; }
  static get WEBSTORE_HOST_PATTERN() { return '*://*.chrome.google.com/*'; }

  constructor() {
    if (!this.isSupportedBrowser_()) {
      chrome.management.uninstallSelf();
      return;
    }
    chrome.installer = Installer.get();

    this.proxy_ = new ContentProxy({
      'management': Management.get(),
      'webstore': Webstore.get(),
      'webstorePrivate': WebstorePrivate.get(),
    });

    this.hideUserAgent_();
    this.reloadWebstoreTabs_();
    this.setupInstallButton_();
  }

  hideUserAgent_() {
    if (!chrome.webRequest) {
      return;
    }
    chrome.webRequest.onBeforeSendHeaders.addListener(
        this.onBeforeSendHeaders_, {
          'urls': [
            this.constructor.CRX_HOST_PATTERN,
            this.constructor.WEBSTORE_HOST_PATTERN,
          ],
        },
        ['blocking', 'requestHeaders']);
  }

  isSupportedBrowser_() {
    if (navigator.userAgent.includes('YaBrowser')) {
      alert(I18n.get('welcomeYandex'));
      return false;
    }
    return true;
  }

  onBeforeSendHeaders_(details) {
    for (const header of details.requestHeaders) {
      if (header.name === 'User-Agent') {
        header.value = header.value.split('OPR')[0].trim();
        break;
      }
    }

    return {requestHeaders: details.requestHeaders};
  }

  onTabChange_(tab) {
    if (!tab.url || !tab.url.includes('chrome.google.com/webstore')) {
      return;
    }

    if (tab.url &&
        tab.url.includes('chrome.google.com/webstore/detail/')) {
      chrome.pageAction.show(tab.id);
    } else {
      chrome.pageAction.hide(tab.id);
    }
  }

  reloadWebstoreTabs_() {
    chrome.tabs.query({'url': this.constructor.WEBSTORE_HOST_PATTERN}, tabs => {
      tabs.forEach(tab => chrome.tabs.reload(tab.id));
    });
  }

  setupInstallButton_() {
    chrome.pageAction.onClicked.addListener(tab => {
      const id = chrome.installer.getIdFromUrl(tab.url);
      if (!id) {
        return;
      }

      chrome.installer.isInstalled(id).then(isInstalled => {
        chrome.pageAction.hide(tab.id);
        if (isInstalled) {
          chrome.installer.navigateToExtensionDetails(id);
          return;
        }

        let onInstallRequest;
        new Promise((resolve, reject) => {
          onInstallRequest = extensionId => {
            if (id === extensionId) {
              resolve();
            }
          };
          chrome.installer.onInstallRequest.addListener(onInstallRequest);
          chrome.tabs.sendMessage(tab.id, this.constructor.ACTION_ADD_TO_OPERA);
          setTimeout(reject, 3000);
        }).then(() => {
          chrome.installer.onInstallRequest.removeListener(onInstallRequest);
        }).catch(() => {
          chrome.installer.onInstallRequest.removeListener(onInstallRequest);
          chrome.installer.install({id});
        });
      });
    });

    chrome.tabs.onActivated.addListener(info => {
      chrome.tabs.get(info.tabId, tab => this.onTabChange_(tab));
    });
    chrome.tabs.onUpdated.addListener(
        (id, changes, tab) => this.onTabChange_(tab));
    chrome.tabs.onCreated.addListener(tab => this.onTabChange_(tab));
  }
}

let app = new App();
