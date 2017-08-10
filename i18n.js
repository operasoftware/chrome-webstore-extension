'use strict';

class I18n {
  static get ATTRIBUTES() {
    return {
      'i18n-content':
          (value, element) => { element.textContent = this.get(value); },
      'i18n-values': (items, element) => {
        for (const item of items.split(';')) {
          let [key, value] = item.split(':');
          value = this.get(value);
          if (key.startsWith('.')) {
            element[key.slice(1)] = value;
          } else {
            element.setAttribute(key, value);
          }
        }
      },
    };
  }

  static get(value, placeholders) {
    return chrome.i18n.getMessage(value, placeholders);
  }

  static process() {
    for (const key in this.ATTRIBUTES) {
      for (const item of document.querySelectorAll(`[${key}]`)) {
        this.ATTRIBUTES[key](item.getAttribute(key), item);
      }
    }
  }
}
