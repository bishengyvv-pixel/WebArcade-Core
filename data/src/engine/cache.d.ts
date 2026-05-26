// [engine/cache.d.ts] EJS_Cache / EJS_CacheItem / EJS_FileItem / EJS_Download 类型声明
// 职责：缓存系统的类型签名
// 不负责：运行时实现（由 cache.js 提供）

declare class EJS_FileItem {
  filename: string;
  bytes: Uint8Array;
  constructor(filename: string, bytes: Uint8Array);
}

declare class EJS_CacheItem {
  key: string;
  files: EJS_FileItem[];
  added: number;
  lastAccessed: number;
  type: string;
  responseType: string;
  filename: string;
  url: string;
  cacheExpiry: number | null;
  fileSize?: number;
  source?: string;

  constructor(
    key: string,
    files: EJS_FileItem[],
    added: number,
    type?: string,
    responseType?: string,
    filename?: string,
    url?: string,
    cacheExpiry?: number | null,
    lastAccessed?: number
  );
  size(): number;
}

declare class EJS_Cache {
  enabled: boolean;
  databaseName: string;
  maxSizeMB: number;
  maxAgeMins: number;
  minAgeMins: number;
  debug: boolean;
  startupCleanupCompleted: boolean;
  storage: import('./storage').EJS_STORAGE | null;
  blobStorage: import('./storage').EJS_STORAGE | null;

  constructor(
    enabled?: boolean,
    databaseName?: string,
    maxSizeMB?: number,
    maxAgeMins?: number,
    debug?: boolean
  );

  createCacheDatabase(): Promise<void>;
  generateCacheKey(dataArray: Uint8Array): string;
  normalizeFileBytes(bytes: Uint8Array | ArrayBuffer | ArrayBufferView): Uint8Array;
  getBlobObjectStore(mode?: IDBTransactionMode): Promise<IDBObjectStore | null>;
  putBlobEntry(key: string, value: any): Promise<void>;
  getBlobEntry(key: string): Promise<any>;
  getBlobManifestKeys(key: string, manifest: any): Set<string>;
  removeBlobEntry(key: string): Promise<void>;
  storeBlobFiles(key: string, files: EJS_FileItem[]): Promise<void>;
  getBlobFiles(key: string): Promise<EJS_FileItem[] | null>;
  removeBlobFiles(key: string): Promise<void>;
  get(key: string, metadataOnly?: boolean, indexName?: string | null): Promise<EJS_CacheItem | null>;
  put(item: EJS_CacheItem): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  cleanup(): Promise<void>;
}

declare class EJS_Download {
  storageCache: EJS_Cache | null;
  EJS: object | null;

  constructor(storageCache?: EJS_Cache | null, EJS?: object | null);

  handleNonHttpUrl(
    url: string,
    type: string,
    method?: string,
    responseType?: string
  ): Promise<EJS_CacheItem | null>;

  downloadFile(
    url: string,
    type: string,
    method?: string,
    headers?: Record<string, string>,
    body?: any,
    onProgress?: ((status: string, percentage: number, loaded: number, total: number) => void) | null,
    onComplete?: ((success: boolean, result: any) => void) | null,
    timeout?: number,
    responseType?: string,
    forceExtract?: boolean,
    dontCache?: boolean,
    dontExtract?: boolean
  ): Promise<EJS_CacheItem>;
}

export { EJS_Cache, EJS_CacheItem, EJS_FileItem, EJS_Download };
