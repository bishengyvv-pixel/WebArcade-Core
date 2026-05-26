// [engine/GameManager.d.ts] EJS_GameManager 类型声明
// 职责：WASM/RetroArch 桥接层的类型签名
// 不负责：运行时实现（由 GameManager.js 提供）

// === Emscripten 运行时接口 ===

interface EmscriptenFS {
  writeFile(path: string, data: string | Uint8Array, opts?: any, flags?: string): void;
  readFile(path: string): Uint8Array;
  unlink(path: string): void;
  mkdir(path: string): void;
  readdir(path: string): string[];
  stat(path: string): { mode: number };
  isDir(mode: number): boolean;
  analyzePath(path: string): { exists: boolean };
  mount(type: any, opts: any, mountpoint: string): void;
  unmount(mountpoint: string): void;
  syncfs(populate: boolean, callback: () => void): void;
  filesystems: { IDBFS: any };
}

interface EmscriptenModule {
  cwrap: (name: string, returnType: string, argTypes: string[]) => (...args: any[]) => any;
  FS: EmscriptenFS;
  callMain: (args: string[]) => void;
  resumeMainLoop: () => void;
  abort: () => void;
  AL?: { currentCtx: { sources: Array<{ gain: AudioNode }>; audioCtx: AudioContext } };
  EmulatorJSGetState: () => Uint8Array;
  callbacks: Record<string, (...args: any[]) => void>;
}

// === EJS_GameManager ===

declare class EJS_GameManager {
  EJS: any;
  Module: EmscriptenModule;
  FS: EmscriptenFS;
  functions: Record<string, (...args: any[]) => any>;

  constructor(Module: EmscriptenModule, EJS: any);

  // 初始化
  setupPreLoadSettings(): void;
  mountFileSystems(): Promise<void>;
  writeConfigFile(): void;
  loadExternalFiles(): Promise<void>;
  initShaders(): void;
  loadPpssppAssets(): Promise<void>;

  // 文件系统
  writeFile(path: string, data: string | Uint8Array): void;
  mkdir(path: string): void;
  writeBootupBatchFile(): string;
  listDir(path: string, indent?: string): void;

  // 模拟控制
  restart(): void;
  clearEJSResetTimer(): void;
  toggleMainLoop(playing: number): void;
  setVSync(enabled: boolean): void;
  setVideoRotation(rotation: number): void;
  setKeyboardEnabled(enabled: boolean): void;
  setAltKeyEnabled(enabled: boolean): void;

  // 存档状态
  getState(): Uint8Array;
  loadState(state: Uint8Array): void;
  quickSave(slot?: number): boolean;
  quickLoad(slot?: number): void;
  supportsStates(): boolean;
  getSaveFile(save?: boolean): Uint8Array | null;
  saveSaveFiles(): void;
  loadSaveFiles(): void;
  getSaveFilePath(): string;

  // 输入
  simulateInput(player: number, index: number, value: number): void;
  setControllerPortDevice(port: number, device: number): void;
  getControllerPortInfo(): string;

  // 速度控制
  toggleFastForward(active: number): void;
  setFastForwardRatio(ratio: number): void;
  toggleSlowMotion(active: number): void;
  setSlowMotionRatio(ratio: number): void;
  setRewindGranularity(value: number): void;

  // 功能
  screenshot(): Promise<Uint8Array>;
  getCoreOptions(): string;
  setVariable(option: string, value: string): void;
  setCheat(index: number, enabled: boolean, code: string): void;
  resetCheat(): void;
  toggleShader(active: number): void;

  // 磁盘
  getDiskCount(): number;
  getCurrentDisk(): number;
  setCurrentDisk(disk: number): void;

  // 信息
  getFileNames(): string[];
  createCueFile(fileNames: string[]): string | null;
  getRetroArchCfg(): string;
  getFrameNum(): number;
  getVideoDimensions(type: string): number;
}

export { EJS_GameManager };
