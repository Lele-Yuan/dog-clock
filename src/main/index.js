const { app } = require('electron');
const { checkUpdate } = require('./checkUpdate');
const { createWindowMenus } = require('./setWindowMenu');
const { appName, isMac, iconPath } = require('./constant');
const { createWindowTray } = require('./setWindowTray');
const { handleIpcMain } = require('./ipcMainListener');
// const { initMainWindow } = require('./mainWindow');
const { initScheme } = require('./setScheme');
const { initFramelessWindow } = require('./framelessWindow');
const { showNotification } = require('./notification');

const windowAllClostCallback = [];

app.setName(appName);
app.dock.setIcon(iconPath);

// 注册协议相关逻辑
initScheme();

let timmer = null;
app.whenReady().then(async () => {
    
    initFramelessWindow(); // 创建右上角无边框窗口，包含一个模态框
    
    showNotification(); // 打开消息通知
    
    // initMainWindow(); // 创建主窗口
    
    createWindowMenus(); // 创建菜单
    
    await createWindowTray(windowAllClostCallback); // 创建托盘

    handleIpcMain(); // 注册全局通讯监听事件
    
    checkUpdate(); // 检查更新
})

// 当所有窗口被关闭后退出应用，macOS 默认是隐藏应用，执行所有 windowAllClostCallback 回调
app.on('window-all-closed', () => {
    console.log('window-all-closed: ');

    // windowAllClostCallback 包含其他操作，例如 退出 托盘
    windowAllClostCallback.forEach(cb => cb());

    // 关闭最后一个页面后退出
    isMac ? app.dock.hide() : app.quit();
    if (timmer) clearInterval(timmer);
});
