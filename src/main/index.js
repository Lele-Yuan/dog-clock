const path = require('path');
const { app, BrowserWindow, screen } = require('electron');
// const { checkUpdate } = require('./checkUpdate');
const { createWindowMenus } = require('./setWindowMenu');
const { appName, protocol, isMac, iconPath } = require('./constant');
const { createWindowTray } = require('./setWindowTray');
const { initIpcMainListener } = require('./ipcMainListener');

let win

// 注册协议
app.setAsDefaultProtocolClient(protocol);

let urlParams = {}

function createWindow() {
    const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
    const screehHeight = screen.getPrimaryDisplay().workAreaSize.height;
    // 获取屏幕的宽度
    // 定义窗口的宽度
    const windowWidth = 800; // 根据你的需求设置窗口宽度
    // 计算窗口的初始 x 坐标（屏幕宽度 - 窗口宽度）
    const initialX = screenWidth - windowWidth;

    const width = parseInt(urlParams.width) || windowWidth
    const height = parseInt(urlParams.height) || 600
    if (win) {
        win.setSize(width, height)
    } else {
        win = new BrowserWindow({
            width,
            height, // 设置窗口宽高
            x: initialX,
            y: 0, // 设置窗口的初始位置为右上角
            resizable: false, // 不允许用户调整窗口大小
            backgroundColor: '#917a68', // 设置窗口的背景色
            // titleBarStyle: 'hiddenInset', // 隐藏标题栏
            // titleBarStyle: 'hidden',
            // trafficLightPosition: { x: 100, y: 100 },
            frame: false, // 隐藏标题栏
            // fullscreenable: false,
            // icon: path.join(__dirname, '../../build/icons/32x32.png'),
            hiddenInMissionControl: true,
            // title: 'anc',
            // vibrancy: 'appearance-based',
            webPreferences: {
                webviewTag: true, // 需要添加webviewTag属性,否则 webview 标签无法使用
                contentSecurityPolicy: `style-src`,
                // contextIsolation: false,
                preload: path.join(__dirname, 'preloadTest.js') // 预加载脚本
            },
        })
        // win.loadURL('https://juejin.cn/user/4476867080110957') // 加载页面
        win.loadFile(path.join(__dirname, '../renderer/helloworld.html'))
    }
}

app.setName(appName);
app.dock.setIcon(iconPath);
initIpcMainListener(win);

app.whenReady().then(() => {
    createWindow();
    createWindowMenus();
    createWindowTray(win);
    // checkUpdate();
})

app.on('window-all-closed', () => {
    // 关闭最后一个页面后退出
    isMac ? app.dock.hide() : app.quit();
});
