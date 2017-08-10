'use strict';

class Webstore extends Api {
  constructor() {
    super();
    this.onDownloadProgress_ = Event.get();
    this.onInstallStageChanged_ = Event.get();
  }

  get onDownloadProgress() { return this.onDownloadProgress_; }
  get onInstallStageChanged() { return this.onInstallStageChanged_; }

  install(url, onSuccess, onFailure) {}
}
