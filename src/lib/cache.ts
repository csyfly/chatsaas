type CacheItem<T> = {
  data: T;
  timestamp: number;
};

export class Cache {
  private cache: { [key: string]: CacheItem<any> } = {};
  private ttl: number;

  constructor(ttlInSeconds: number = 3600) { // 默认 TTL 为 1 小时
    this.ttl = ttlInSeconds * 1000; // 转换为毫秒
  }

  get<T>(key: string): T | null {
    const item = this.cache[key];
    if (item && Date.now() - item.timestamp < this.ttl) {
      return item.data;
    }
    return null;
  }

  set<T>(key: string, data: T): void {
    this.cache[key] = {
      data,
      timestamp: Date.now(),
    };
  }

  clear(): void {
    this.cache = {};
  }

  // 可选：添加一个方法来删除单个缓存项
  remove(key: string): void {
    delete this.cache[key];
  }
}

// 创建一个默认的缓存实例
export const defaultCache = new Cache();