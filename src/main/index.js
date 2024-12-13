const { app } = require('electron');
// const { checkUpdate } = require('./checkUpdate');
const { createWindowMenus } = require('./setWindowMenu');
const { appName, protocol, isMac, iconPath } = require('./constant');
const { createWindowTray } = require('./setWindowTray');
const { handleIpcMain } = require('./ipcMainListener');
const { initMainWindow } = require('./mainWindow');

// 注册协议
app.setAsDefaultProtocolClient(protocol);

const windowAllClostCallback = [];

app.setName(appName);
app.dock.setIcon(iconPath);

let timmer = null;
app.whenReady().then(async () => {
    // 创建主窗口
    initMainWindow();
    // 创建菜单
    createWindowMenus();
    // 创建托盘
    await createWindowTray(windowAllClostCallback);
    // checkUpdate();

    // 注册全局通讯监听
    handleIpcMain();
})

// 当所有窗口被关闭后退出应用，macOS 默认是隐藏应用
// windowAllClostCallback 包含其他操作，例如 退出 托盘
app.on('window-all-closed', () => {
    console.log('window-all-closed: ');
    windowAllClostCallback.forEach(cb => cb());
    // 关闭最后一个页面后退出
    isMac ? app.dock.hide() : app.quit();
    if (timmer) clearInterval(timmer);
});
