'use strict';

class Proxy {
  static get APIs() { return []; }

  static get EVENT_API_DEF() { return 'api-def'; }
  static get EVENT_API_RESPONSE() { return 'api-response'; }
  static get EVENT_MESSAGE() { return 'message'; }

  static get SCRIPTS() {
    return [
      '/api/api.js',
      '/api/event.js',
      '/content/callback_registry.js',
      '/content/inject/proxy_element.js',
    ];
  }

  constructor() {
    this.channel_ = new Channel();
    this.id_ = `proxy-${Date.now()}`;
    this.proxy_ = null;

    Promise
        .all([
          this.loadApis_(),
          this.loadScripts_().then(scripts => {
            let completed = this.watch_();
            this.inject_(scripts);
            return completed;
          }),
        ])
        .then(result => this.initialize_(result[0]));
  }

  inject_(scripts) {
    let script = document.createElement('script');
    script.textContent = `'use strict';
        (function() {
          let ID = '${this.id_}';
          ${scripts.join('\n\n')}
        })();`;
    document.head.insertBefore(script, document.head.firstChild);
    script.remove();
  }

  loadScripts_() {
    return Promise.all(this.constructor.SCRIPTS.map(
        url => this.channel_.fetch(url).then(data => data[0])));
  }

  loadApis_() {
    return Promise.all(this.constructor.APIs.map(
        name => this.channel_.send('getDefinition', [name])
                    .then(data => ({name: name, data: data[0]}))));
  }

  watch_() {
    return new Promise(resolve => {
      this.proxy_ = null;
      let observer = new MutationObserver(records => {
        if (this.proxy_) {
          return;
        }
        this.proxy_ = document.querySelector(this.id_);
        if (this.proxy_) {
          observer.disconnect();
          this.proxy_.remove();
          resolve();
        }
      });

      observer.observe(document.documentElement, {childList: true});
    });
  }

  initialize_(apis) {
    this.proxy_.addEventListener(this.constructor.EVENT_MESSAGE, e => {
      this.channel_.forward(e.detail, message => {
        let event = new CustomEvent(
            this.constructor.EVENT_API_RESPONSE, {detail: message});
        this.proxy_.dispatchEvent(event);
      });
    });
    apis.forEach(api => {
      let event =
          new CustomEvent(this.constructor.EVENT_API_DEF, {detail: api});
      this.proxy_.dispatchEvent(event);
    });
  }
}
