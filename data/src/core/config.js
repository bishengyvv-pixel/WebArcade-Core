// [core/config.js] 配置管理
// 职责：getSettingValue、menuOptionChanged、preGetSetting 等配置的读取、验证与持久化
// 不负责：配置 UI 的 DOM 构建（由 ui/menu.js 处理）

export function preGetSetting(emu, setting) {
    if (window.localStorage && !emu.config.disableLocalStorage) {
        let coreSpecific = localStorage.getItem(emu.getLocalStorageKey());
        try {
            coreSpecific = JSON.parse(coreSpecific);
            if (coreSpecific && coreSpecific.settings) {
                return coreSpecific.settings[setting];
            }
        } catch(e) {
            console.warn("Could not load previous settings", e);
        }
    }
    if (emu.config.defaultOptions && emu.config.defaultOptions[setting]) {
        return emu.config.defaultOptions[setting];
    }
    return null;
}

export function menuOptionChanged(emu, option, value) {
    emu.saveSettings();
    emu.allSettings[option] = value;
    if (emu.debug) console.log(option, value);
    if (!emu.gameManager) return;
    emu.handleSpecialOptions(option, value);
    emu.gameManager.setVariable(option, value);
    emu.saveSettings();
}

export function getSettingValue(emu, id) {
    return emu.allSettings[id] || emu.settings[id] || null;
}
