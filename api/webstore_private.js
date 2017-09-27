'use strict';

class WebstorePrivate extends Api {
  constructor(installer) {
    super();
    this.installer_ = installer;
  }

  get Result() { return this.installer_.Result; }

  get WebGlStatus() {
    return {
      WEBGL_ALLOWED: 'webgl_allowed',
      WEBGL_BLOCKED: 'webgl_blocked',
    };
  }

  beginInstallWithManifest3({id, manifest}, callback) {
    manifest = JSON.parse(manifest);

    this.installer_.install(
        {id, manifest},
        () => callback(''),
        () => callback(this.Result.USER_CANCELLED));
  }

  completeInstall(id, callback) {
    if (callback) {
      callback([]);
    }
  }

  enableAppLauncher() {}

  getBrowserLogin(callback) {
    this.getStoreLogin(login => callback({'login': login}));
  }

  getEphemeralAppsEnabled(callback) {
    if (callback) {
      callback(false);
    }
  }

  getIsLauncherEnabled(callback) {
    if (callback) {
      callback(false);
    }
  }

  getStoreLogin(callback) { callback(localStorage.getItem('login') || ''); }

  getWebGLStatus(callback) { callback(this.WebGlStatus.WEBGL_ALLOWED); }

  install() {}

  isInIncognitoMode(callback) {
    if (callback) {
      callback(false);
    }
  }

  isPendingCustodianApproval(id, callback) {
    if (callback) {
      callback(false);
    }
  }

  launchEphemeralApp(id, callback) {
    if (callback) {
      callback();
    }
  }

  setStoreLogin(login, callback) {
    localStorage.setItem('login', login);
    callback();
  }
}
