'use strict';

class App extends Api {
  get isInstalled() { return true; }

  getDetails() {
    return {
      'app': {
        'launch': {
          'web_url': 'https://chrome.google.com/webstore',
        },
        'urls': [
          'https://chrome.google.com/webstore',
        ],
      },
      'description': 'Discover great apps, games, extensions and themes for Google Chrome.',
      'icons': {
        '16': 'webstore_icon_16.png',
        '128': 'webstore_icon_128.png',
      },
      'id': 'ahfgeienlihckogmohjhadlkjgocpleb',
      'key': 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCtl3tO0osjuzRsf6xtD2SKxPlTfuoy7AWoObysitBPvH5fE1NaAA1/2JkPWkVDhdLBWLaIBPYeXbzlHp3y4Vv/4XG+aN5qFE3z+1RU/NqkzVYHtIpVScf3DjTYtKVL66mzVGijSoAIwbFCC3LpGdaoe6Q1rSRDp76wR6jjFzsYwQIDAQAB',
      'name': 'Web Store',
      'permissions': [
        'webstorePrivate',
        'management',
        'system.cpu',
        'system.display',
        'system.memory',
        'system.network',
        'system.storage',
      ],
      'version': '0.2',
    }
  }

  getIsInstalled() { return this.isInstalled; }

  installState(callback) {
    if (callback) {
      callback('installed');
    }
  }

  runningState() { return 'cannot_run'; }
}
