'use strict';

class Installer extends Api {
  static get CRX_HOST() {
    return 'https://clients2.google.com/service/update2/crx';
  }

  static get MAX_DOWNLOADING_TIME() { return 45 * 1000; }

  constructor() {
    super();
    this.onDownloadProgress_ = Event.get();
    this.onInstallRequest_ = Event.get();
    this.onInstallStageChanged_ = Event.get();

    this.jobs_ = new Map();
    this.browserVersion_ = navigator.userAgent.match(/chrome\/([0-9.]*)\s/i)[1];
    chrome.runtime.getPlatformInfo(
        platformInfo => this.platformInfo_ = platformInfo);

    chrome.management.onInstalled.addListener(details => {
      if (details && details.id) {
        this.jobComplete_(details.id, this.Result.SUCCESS);
      }
    });
    chrome.management.onUninstalled.addListener(id => {
      if (id) {
        this.jobComplete_(id, this.Result.USER_CANCELLED);
      }
    });
  }

  get InstallStage() {
    return {
      DOWNLOADING: 'downloading',
      INSTALLING: 'installing',
    };
  }

  get Result() {
    return {
      ALREADY_INSTALLED: 'already_installed',
      BLACKLISTED: 'blacklisted',
      BLOCKED_BY_POLICY: 'blocked_by_policy',
      FEATURE_DISABLED: 'feature_disabled',
      ICON_ERROR: 'icon_error',
      INSTALL_ERROR: 'install_error',
      INSTALL_IN_PROGRESS: 'install_in_progress',
      INVALID_ICON_URL: 'invalid_icon_url',
      INVALID_ID: 'invalid_id',
      LAUNCH_IN_PROGRESS: 'launch_in_progress',
      MANIFEST_ERROR: 'manifest_error',
      MISSING_DEPENDENCIES: 'missing_dependencies',
      SUCCESS: 'success',
      UNKNOWN_ERROR: 'unknown_error',
      UNSUPPORTED_EXTENSION_TYPE: 'unsupported_extension_type',
      USER_CANCELLED: 'user_cancelled',
      USER_GESTURE_REQUIRED: 'user_gesture_required',
    };
  }

  get onDownloadProgress() { return this.onDownloadProgress_; }
  get onInstallRequest() { return this.onInstallRequest_; }
  get onInstallStageChanged() { return this.onInstallStageChanged_; }

  isInstalled(id) {
    return this.getExtension_(id).then(
        extension => Boolean(extension) && extension.enabled);
  }

  isTypeSupported_(manifest) {
    if (Api.isTheme(manifest)) {
      alert(chrome.i18n.getMessage('installerNotSupportedTheme'));
      return false;
    }

    if (Api.isApp(manifest)) {
      alert(chrome.i18n.getMessage('installerNotSupportedApp'));
      return false;
    }

    return true;
  }

  getDownload_(url) {
    return new Promise(resolve => {
      chrome.downloads.search({}, items => {
        items = items.filter(item => item.url === url);
        if (items) {
          const item = items[0];
          chrome.downloads.erase({url});
          resolve(item);
        } else {
          resolve(null);
        }
      });
    });
  }

  getDownloadData_(id) {
    const params = new URLSearchParams('');
    params.append('response', 'redirect');
    params.append('os', this.platformInfo_.os);
    params.append('arch', this.platformInfo_.arch);
    params.append('nacl_arch', this.platformInfo_.nacl_arch);
    params.append('prod', 'chromiumcrx');
    params.append('prodchannel', 'unknown');
    params.append('prodversion', this.browserVersion_);
    params.append('acceptformat', 'crx2,crx3');
    params.append('x', `id=${id}&uc`);

    return {
      'filename': `${id}.nex`,
      'url': `${this.constructor.CRX_HOST}?${params}`,
    };
  }

  getExtension_(id) {
    return new Promise(resolve => {
      chrome.management.get(
          id, details => resolve(
                  (chrome.runtime.lastError || !details) ? null : details));
    });
  }

  getIdFromUrl(url) {
    url = new URL(url);
    const id = url.pathname.split('/').reduceRight(
          (id, value) => (id || (/^[a-z]{32}$/.test(value) && value)), null);
    if (id) {
      return id;
    }
  }

  accept_(id, manifestState) {
    this.onInstallStageChanged.dispatch(
        {id, stage: this.InstallStage.INSTALLING});
    if (manifestState === Api.FEATURE_NOT_SUPPORTED) {
      alert(chrome.i18n.getMessage('installerFinalizeNotSupported'));
    } else if (
        manifestState === Api.FEATURE_MAY_WORK ||
        manifestState === Api.FEATURE_MAY_WORK_WITHOUT) {
      alert(chrome.i18n.getMessage('installerFinalizeMayWork'));
    } else {
      alert(chrome.i18n.getMessage('installerFinalize'));
    }

    this.navigateToExtensionDetails(id);
  }

  download_(id) {
    const options = this.getDownloadData_(id);
    const maxTime = Date.now() + this.constructor.MAX_DOWNLOADING_TIME;
    this.onDownloadProgress.dispatch({id, percentDownloaded: 0});
    this.onInstallStageChanged.dispatch(
        {id, stage: this.InstallStage.DOWNLOADING});
    return new Promise((resolve, reject) => {
      
      chrome.downloads.download(options, (downloadId) => {
        if (downloadId) {
          this.onDownloadProgress.dispatch({id, percentDownloaded: 1});
          resolve();
        } else {
          this.getDownload_(options.url).then((download) => {
            if (download && download.error) {
              alert(chrome.i18n.getMessage('installerErrorNetwork'));
            } else if (Date.now() > maxTime) {
              alert(chrome.i18n.getMessage('installerErrorTimeout'));
            }
            reject();            
          }).catch(() => {
            reject();
          });
        }
      });
      
    });
  }

  install({manifest, id}, onComplete = () => {}, onError = () => {}) {
    this.onInstallRequest.dispatch(id);
    this.jobs_.set(id, status => {
      this.jobs_.delete(id);
      if (status === this.Result.SUCCESS) {
        onComplete();
      } else {
        onError(status);
      }
    });

    if (!id) {
      this.jobComplete_(id, this.Result.INVALID_ID);
      return;
    }

    if (manifest && !this.isTypeSupported_(manifest)) {
      this.jobComplete_(id, this.Result.UNSUPPORTED_EXTENSION_TYPE);
      return;
    }

    const manifestState =
          manifest ? Api.isManifestSupported(manifest) : Api.FEATURE_SUPPORTED;

    this.getExtension_(id).then(extension => {
      if (extension) {
        if (extension.enabled) {
          this.navigateToExtensionDetails(id);
          this.jobComplete_(id, this.Result.SUCCESS);
        } else {
          this.accept_(id, manifestState);
        }
      } else {
        this.download_(id)
            .then(() => this.accept_(id, manifestState))
            .catch(() => this.jobComplete_(id, this.Result.UNKNOWN_ERROR));
      }
    });
  }

  jobComplete_(id, status) {
    const complete = this.jobs_.get(id);
    if (complete) {
      complete(status);
    }
  }

  navigateToExtensionDetails(id) {
    chrome.tabs.create({
      'url': `chrome://extensions?id=${id}`,
      'active': true,
    });
  }
}
