class RequestCache {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl;
    this.pending = new Map();
  }

  getKey(endpoint, options) {
    return `${endpoint}_${JSON.stringify(options || {})}`;
  }

  get(endpoint, options) {
    const key = this.getKey(endpoint, options);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }
    
    this.cache.delete(key);
    return null;
  }

  set(endpoint, options, data) {
    const key = this.getKey(endpoint, options);
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  getPending(endpoint, options) {
    const key = this.getKey(endpoint, options);
    return this.pending.get(key);
  }

  setPending(endpoint, options, promise) {
    const key = this.getKey(endpoint, options);
    this.pending.set(key, promise);
    promise.finally(() => this.pending.delete(key));
  }

  clear() {
    this.cache.clear();
    this.pending.clear();
  }
}

export default new RequestCache();
