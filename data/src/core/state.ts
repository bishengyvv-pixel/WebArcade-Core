// [core/state.js] UI 状态管理 (StateStore)
// 职责：集中管理所有 UI 相关状态（isPlaying、isPaused、volume 等），提供 get/set/on/off 接口
// 不负责：模拟引擎内部状态（WASM 中的 RetroArch 运行时由 engine/GameManager.js 管理）
