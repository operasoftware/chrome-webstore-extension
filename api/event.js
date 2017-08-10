'use strict';

class Event extends Api {
  static get base() { return new (class Event {})(); }
  constructor(event, filter) {
    super();
    this.event_ = event;
    /*
    this.ruleID_ = 0;
    this.rules_ = new Map();
    */
    this.listeners_ = new Set();

    if (filter instanceof Function) {
      this.listen_ = data => {
        if (filter(data)) {
          this.dispatch(data);
        }
      }
    } else {
      this.listen_ = data => this.dispatch(data);
    }
  }

  addListener(listener) {
    if (!listener) {
      return;
    }
    if (!this.listeners_.size && this.event_) {
      this.event_.addListener(this.listen_);
    }
    this.listeners_.add(listener);
  }

  dispatch(data) { this.listeners_.forEach(listener => listener(data)); }
  dispatchToListener(data, listener) { listener(data); }
  hasListener(listener) { return this.listeners_.has(listener); }
  hasListeners() { return this.listeners_.size > 0; }

  removeListener(listener) {
    if (this.hasListener(listener)) {
      this.listeners_.delete(listener);
      if (!this.listeners_.size && this.event_) {
        this.event_.removeListener(this.listen_);
      }
    }
  }

  addRules(rules, callback) {
    /*
    rules = rules.map(rule => {
      let id = rule.id;
      if (!id) {
        this.ruleID_ = (this.ruleID_ + 1) % 10000;
        id = `${this.ruleID_}${Date.now()}`;
      }
      rule.id = id;
      rule.priority = rule.priority || 100;
      this.rules_.set(id, rule);
      return rule;
    });

    if (callback) {
      callback(rules);
    }
    */
  }

  getRules(ruleIdentifiers, callback) {
    /*
    if (callback) {
      callback(ruleIdentifiers.map(id => this.rules_.get(id)));
    }
    */
  }

  removeRules(ruleIdentifiers, callback) {
    /*
    ruleIdentifiers.forEach(id => this.rules_.delete(id));
    if (callback) {
      callback();
    }
    */
  }
}
