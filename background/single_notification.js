'use strict';

class SingleNotification {
  constructor() {
    this.id_ = null;
    this.onClickCallback_ = null;
    chrome.notifications.onClosed.addListener(id => this.onClosed_(id));
    chrome.notifications.onClicked.addListener(id => this.onClicked_(id));
  }

  fill(title, message, onClickCallback) {
    let data = {
      title: title,
      message: message,
    };

    data.iconUrl = data.iconUrl ? data.iconUrl : SingleNotification.ICON;
    data.type = SingleNotification.TYPE;
    if (this.id_) {
      chrome.notifications.clear(this.id_);
      this.id_ = null;
      this.onClickCallback_ = null;
    }
    chrome.notifications.create(data, id => this.id_ = id);

    if (onClickCallback) {
      this.onClickCallback_ = () => onClickCallback();
    }
  }

  onClicked_(id) {
    if (this.id_ !== id) {
      return;
    }

    if (this.onClickCallback_) {
      this.onClickCallback_();
    }

    chrome.notifications.clear(this.id_);
    this.id_ = null;
  }

  onClosed_(id) {
    if (this.id_ !== id) {
      return;
    }
    this.id_ = null;
  }
}

SingleNotification.TYPE = 'basic';
SingleNotification.ICON = 'icons/128.png';
