'use strict';

class Api {
  static get EXTENSION_MANIFEST() {
    return {
      'author': this.FEATURE_SUPPORTED,
      'automation': this.FEATURE_NOT_SUPPORTED,
      'background': this.FEATURE_SUPPORTED,
      'background_page': this.FEATURE_NOT_SUPPORTED,
      'browser_action': this.FEATURE_SUPPORTED,
      'chrome_settings_overrides': this.FEATURE_NOT_SUPPORTED,  // no effect
      'chrome_ui_overrides': this.FEATURE_MAY_WORK_WITHOUT,     // no effect
      'chrome_url_overrides': this.FEATURE_NOT_SUPPORTED,
      'commands': this.FEATURE_SUPPORTED,
      'content_capabilities': this.FEATURE_NOT_SUPPORTED,  // need more tests
      'content_scripts': this.FEATURE_SUPPORTED,
      'content_security_policy': this.FEATURE_SUPPORTED,
      'converted_from_user_script': this.FEATURE_SUPPORTED,
      'current_locale': this.FEATURE_SUPPORTED,
      'default_locale': this.FEATURE_SUPPORTED,
      'description': this.FEATURE_SUPPORTED,
      'devtools_page': this.FEATURE_SUPPORTED,
      'event_rules': this.FEATURE_SUPPORTED,
      'export': this.FEATURE_MAY_WORK,  // need more tests
      'externally_connectable': this.FEATURE_SUPPORTED,
      'file_browser_handlers': this.FEATURE_MAY_WORK_WITHOUT,
      'file_system_provider_capabilities': this.FEATURE_NOT_SUPPORTED,
      'homepage_url': this.FEATURE_SUPPORTED,
      'icons': this.FEATURE_SUPPORTED,
      'import': this.FEATURE_MAY_WORK,  // need more tests
      'incognito': this.FEATURE_SUPPORTED,
      'input_components': this.FEATURE_NOT_SUPPORTED,
      'key': this.FEATURE_SUPPORTED,
      'manifest_version': this.FEATURE_SUPPORTED,
      'minimum_chrome_version': this.FEATURE_SUPPORTED,  // no effect
      'nacl_modules': this.FEATURE_NOT_SUPPORTED,        // no effect
      'name': this.FEATURE_SUPPORTED,
      'oauth2': this.FEATURE_MAY_WORK,
      'offline_enabled': this.FEATURE_MAY_WORK_WITHOUT,  // no effect
      'omnibox': this.FEATURE_SUPPORTED,
      'optional_permissions': this.FEATURE_SUPPORTED,
      'options_page': this.FEATURE_SUPPORTED,
      'options_ui': this.FEATURE_MAY_WORK,
      'page_action': this.FEATURE_SUPPORTED,
      'permissions': {
        'activeTab': this.FEATURE_SUPPORTED,
        'alarms': this.FEATURE_SUPPORTED,
        'background': this.FEATURE_MAY_WORK_WITHOUT,  // can work without
        'bookmarks': this.FEATURE_SUPPORTED,
        'browsingData': this.FEATURE_SUPPORTED,
        'certificateProvider': this.FEATURE_NOT_SUPPORTED,
        'clipboardRead': this.FEATURE_SUPPORTED,
        'clipboardWrite': this.FEATURE_SUPPORTED,
        'contentSettings': this.FEATURE_SUPPORTED,
        'contextMenus': this.FEATURE_SUPPORTED,
        'cookies': this.FEATURE_SUPPORTED,
        'debugger': this.FEATURE_SUPPORTED,
        'declarativeContent': this.FEATURE_SUPPORTED,
        'declarativeWebRequest': this.FEATURE_SUPPORTED,
        'desktopCapture': this.FEATURE_SUPPORTED,
        'displaySource': this.FEATURE_NOT_SUPPORTED,
        'dns': this.FEATURE_NOT_SUPPORTED,
        'documentScan': this.FEATURE_NOT_SUPPORTED,
        'downloads': this.FEATURE_SUPPORTED,
        'enterprise.deviceAttributes': this.FEATURE_NOT_SUPPORTED,
        'enterprise.platformKeys': this.FEATURE_NOT_SUPPORTED,
        'experimental': this.FEATURE_NOT_SUPPORTED,
        'fileBrowserHandler': this.FEATURE_MAY_WORK_WITHOUT,
        'fileSystemProvider': this.FEATURE_NOT_SUPPORTED,
        'fontSettings': this.FEATURE_SUPPORTED,
        'gcm': this.FEATURE_SUPPORTED,
        'geolocation': this.FEATURE_SUPPORTED,
        'history': this.FEATURE_SUPPORTED,
        'identity': this.FEATURE_NOT_SUPPORTED,  // 90% not supported
        'idle': this.FEATURE_SUPPORTED,
        'idltest': this.FEATURE_NOT_SUPPORTED,
        'management': this.FEATURE_SUPPORTED,
        'nativeMessaging': this.FEATURE_SUPPORTED,
        'networking.config': this.FEATURE_NOT_SUPPORTED,
        'notificationProvider': this.FEATURE_NOT_SUPPORTED,
        'notifications': this.FEATURE_SUPPORTED,
        'pageCapture': this.FEATURE_SUPPORTED,
        'platformKeys': this.FEATURE_NOT_SUPPORTED,
        'power': this.FEATURE_SUPPORTED,
        'printerProvider': this.FEATURE_SUPPORTED,
        'privacy': this.FEATURE_SUPPORTED,
        'processes': this.FEATURE_NOT_SUPPORTED,  // dev only
        'proxy': this.FEATURE_SUPPORTED,
        'sessions': this.FEATURE_SUPPORTED,
        'signedInDevices': this.FEATURE_NOT_SUPPORTED,  // dev only
        'storage': this.FEATURE_MAY_WORK,               // sync ?
        'system.cpu': this.FEATURE_SUPPORTED,
        'system.display': this.FEATURE_SUPPORTED,
        'system.memory': this.FEATURE_SUPPORTED,
        'system.storage': this.FEATURE_SUPPORTED,
        // dev only by mistake will be fixed soon
        'tabCapture': this.FEATURE_SUPPORTED,
        'tabs': this.FEATURE_SUPPORTED,
        'topSites': this.FEATURE_SUPPORTED,
        'tts': this.FEATURE_SUPPORTED,
        'ttsEngine': this.FEATURE_SUPPORTED,
        'unlimitedStorage': this.FEATURE_SUPPORTED,
        'vpnProvider': this.FEATURE_NOT_SUPPORTED,
        'wallpaper': this.FEATURE_NOT_SUPPORTED,
        'webNavigation': this.FEATURE_SUPPORTED,
        'webRequest': this.FEATURE_SUPPORTED,
        'webRequestBlocking': this.FEATURE_SUPPORTED,
        'webview': this.FEATURE_MAY_WORK,  // yet
        'windows': this.FEATURE_SUPPORTED,
      },
      'platforms': this.FEATURE_NOT_SUPPORTED,  // for NaCL
      'plugins': this.FEATURE_SUPPORTED,
      'requirements': this.FEATURE_SUPPORTED,
      'sandbox': this.FEATURE_SUPPORTED,
      'short_name': this.FEATURE_SUPPORTED,
      'signature': this.FEATURE_NOT_SUPPORTED,
      'spellcheck': this.FEATURE_SUPPORTED,
      'storage': this.FEATURE_SUPPORTED,
      'system_indicator': this.FEATURE_MAY_WORK_WITHOUT,  // no effect
      'tts_engine': this.FEATURE_SUPPORTED,
      'update_url': this.FEATURE_SUPPORTED,
      'version': this.FEATURE_SUPPORTED,
      'version_name': this.FEATURE_SUPPORTED,
      'web_accessible_resources': this.FEATURE_SUPPORTED,
      'webview': this.FEATURE_MAY_WORK,  // yet
    };
  }

  static get FEATURE_MAY_WORK() { return 'feature_may_work'; }
  static get FEATURE_MAY_WORK_WITHOUT() { return 'feature_may_work_without'; }
  static get FEATURE_NOT_SUPPORTED() { return 'feature_not_supported'; }
  static get FEATURE_SUPPORTED() { return 'feature_supported'; }
  static get TYPE_EVENT() { return 'event'; }
  static get TYPE_FUNCTION() { return 'function'; }
  static get TYPE_OBJECT() { return 'object'; }

  static areFeaturesSupported_(features, dictionary) {
    const states = features.map(feature => {
      if (this.isHostPattern_(feature)) {
        return this.FEATURE_SUPPORTED;
      }

      const state = dictionary[feature] || this.FEATURE_NOT_SUPPORTED;
      return state instanceof Object ? this.FEATURE_SUPPORTED : state;
    });

    return this.getComputedFeatureState_(states);
  }

  static get base() { return {}; }

  static get() {
    let cl = new this(...arguments);
    let api = this.base;
    let props = Object.getOwnPropertyNames(Object.getPrototypeOf(cl));
    for (let prop of props) {
      if (prop !== 'constructor' && !prop.endsWith('_')) {
        if (cl[prop] instanceof Function) {
          api[prop] = cl[prop].bind(cl);
        } else {
          api[prop] = cl[prop];
        }
      }
    }

    return api;
  }

  static getComputedFeatureState_(states) {
    if (states.some(state => state === this.FEATURE_NOT_SUPPORTED)) {
      return this.FEATURE_NOT_SUPPORTED;
    }
    if (states.some(state => state === this.FEATURE_MAY_WORK)) {
      return this.FEATURE_MAY_WORK;
    }
    if (states.some(state => state === this.FEATURE_MAY_WORK_WITHOUT)) {
      return this.FEATURE_MAY_WORK_WITHOUT;
    }
    return this.FEATURE_SUPPORTED;
  }

  static isApp(manifest) { return 'app' in manifest; }

  static isExtension(manifest) {
    return !(this.isApp(manifest) || this.isTheme(manifest));
  }

  static isHostPattern_(value) {
    return value === '<all_urls>' || value.includes('://');
  }

  static isManifestSupported(manifest) {
    const states = [];
    const permissions = manifest.permissions;
    const optionalPermissions = manifest.optional_permissions;
    states.push(this.areFeaturesSupported_(
        Object.keys(manifest), this.EXTENSION_MANIFEST));
    if (optionalPermissions) {
      states.push(this.areFeaturesSupported_(
          optionalPermissions, this.EXTENSION_MANIFEST.permissions));
    }
    if (permissions) {
      states.push(this.areFeaturesSupported_(
          permissions, this.EXTENSION_MANIFEST.permissions));
    }

    return this.getComputedFeatureState_(states);
  }

  static isTheme(manifest) { return 'theme' in manifest; }
}
