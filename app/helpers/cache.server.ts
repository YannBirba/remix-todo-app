import {
  cachified,
  lruCacheAdapter,
  type CacheEntry,
} from "@epic-web/cachified";
import { LRUCache } from "lru-cache";

const lru = new LRUCache<string, CacheEntry>({ max: 1000 });
export const cache = lruCacheAdapter(lru);