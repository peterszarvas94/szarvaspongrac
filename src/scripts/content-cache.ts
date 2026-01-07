// In-memory content cache
const contentCache = new Map<string, string>();

export function getCachedContent(key: string): string | undefined {
  return contentCache.get(key);
}

export function setCachedContent(key: string, value: string): void {
  contentCache.set(key, value);
}
