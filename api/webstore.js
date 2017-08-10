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

/*

    if (!details || !details.manifest) {
      return Promise.reject();
    }

    let notification = new SingleNotification();
    let id = details.id;
    let name = details.localizedName;
    let manifest = JSON.parse(details.manifest);
    if (manifest.app !== undefined) {
      notification.fill(I18n.get('titleError', [name]),
                        I18n.get('unsupportedApp'));
      return Promise.reject();
    } else if (manifest.theme !== undefined) {
      notification.fill(I18n.get('titleError', [name]),
                        I18n.get('unsupportedTheme'));
      return Promise.reject();
    } else {
      return new Promise((resove, reject) => {
        this.getDownloadLink_(details.id).then(link => {
          if (!link) {
            Promise.reject();
          }

          chrome.downloads.download({
            'url': link,
            'filename': `${id}.nex`,
          }, downloadItemId => {
             new Promise((resolve, reject) => {
                let interv = setInterval(() => {
                  chrome.management.get(id, info => {
                    if (chrome.runtime.lastError || !info) {
                      return;
                    } else {
                      clearInterval(interv);
                      resolve();
                    }
                  });
                }, 300);
             }).then(() => {
               notification.fill(name, I18n.get('downloadedMessage'), () => {
                 chrome.tabs.create({
                   'url': (`chrome://extensions?id=${id}`),
                   'active': true,
                 });
               });
             }).catch(() => {});
          });
        });
      });
    }
  }
}
*/
