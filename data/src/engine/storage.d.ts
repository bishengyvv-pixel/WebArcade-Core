// [engine/storage.d.ts] EJS_STORAGE / EJS_DUMMYSTORAGE 类型声明
// 职责：IndexedDB 封装的类型签名
// 不负责：运行时实现（由 storage.js 提供）

declare class EJS_STORAGE {
  constructor(dbName: string, storeName: string, indexes?: string[] | null);
  addFileToDB(key: string, add: boolean): void;
  getObjectStore(mode?: IDBTransactionMode): Promise<IDBObjectStore | undefined>;
  get(key: string, indexName?: string | null): Promise<any>;
  put(key: string, data: any): Promise<void>;
  remove(key: string): Promise<void>;
  getSizes(): Promise<Record<string, number>>;
  getAll(): Promise<any[]>;
  getKeys(): Promise<string[]>;
}

declare class EJS_DUMMYSTORAGE {
  constructor();
  addFileToDB(): Promise<void>;
  get(): Promise<undefined>;
  put(): Promise<void>;
  remove(): Promise<void>;
  getSizes(): Promise<Record<string, never>>;
}

export { EJS_STORAGE, EJS_DUMMYSTORAGE };
