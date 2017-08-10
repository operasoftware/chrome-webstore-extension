'use strict';

class Page {
  static get ADD_BUTTON_CLASS_NAME() { return 'webstore-test-button-label'; }
  constructor() {
    this.adaptButtons_();
    this.hideOpera_();
    this.injectProxyElement_();
    this.addApis_();
  }

  adaptButtons_() {
    let observer = new MutationObserver(records => {
      records.forEach(record => {
        if (!record.addedNodes) {
          return;
        }

        Array.from(record.addedNodes).forEach(node => {
          if (!node.classList || !node.querySelectorAll) {
            return;
          }

          let items = [];

          if (node.classList &&
              node.classList.contains(this.constructor.ADD_BUTTON_CLASS_NAME)) {
            items.push(node);
          } else if (node.querySelectorAll) {
            items = Array.from(node.querySelectorAll(
                `.${this.constructor.ADD_BUTTON_CLASS_NAME}`));
          }

          items.forEach(element => {
            let root = element;
            let text = element.textContent;

            if (element.shadowRoot) {
              root = element.shadowRoot;
              text = root.textContent;
            } else {
              root = element.createShadowRoot();
            }

            root.textContent = text.replace(/chrome/ig, 'Opera');
          });
        });
      });
    });

    observer.observe(
        document.documentElement, {childList: true, subtree: true});
  }

  addApis_() {
    Reflect.defineProperty(chrome, 'app', {value: App.get()});
  }

  hideOpera_() {
    let userAgent = navigator.userAgent.split('OPR')[0].trim();
    Reflect.defineProperty(navigator, 'userAgent', {value: userAgent});
    let appVersion = navigator.appVersion.split('OPR')[0].trim();
    Reflect.defineProperty(navigator, 'appVersion', {value: appVersion});
    Reflect.deleteProperty(window, 'opr');
  }

  injectProxyElement_() {
    document.documentElement.appendChild(
        document.createElement(ProxyElement.ELEMENT_NAME));
  }
}

new Page();
