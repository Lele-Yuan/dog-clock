const path = require('path');
const { screen, BrowserWindow, nativeTheme } = require('electron');
const { themeColors } = require('./windowTheme');

exports.createWindow = function({
    width = 800,
    height = 600,
    url = path.join(__dirname, '../renderer/index.html')
}) {
    // 获取屏幕的宽度
    const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
    // 计算窗口的初始 x 坐标（屏幕宽度 - 窗口宽度）
    const initialX = screenWidth - width;
    const childWin = new BrowserWindow({
        width,
        height, // 设置窗口宽高
        x: initialX,
        y: 0, // initialX, 0 设置窗口的初始位置为右上角
        backgroundColor: themeColors[nativeTheme.themeSource].backgroundColor,
        // resizable: false, // 不允许用户调整窗口大小
        // frame: false, // 隐藏标题栏
        // hiddenInMissionControl: true,
        webPreferences: {
            webviewTag: true, // 需要添加webviewTag属性,否则 webview 标签无法使用
            contentSecurityPolicy: `style-src`,
            preload: path.join(__dirname, 'preloadTest.js') // 预加载脚本
        },
    })
    console.log('url: ', url);
    if (url.startsWith('http') || url.startsWith('infoflow')) {
        childWin.loadURL(url);
    } else {
        childWin.loadFile(url);
        childWin.loadFile(path.join(__dirname, `../renderer/${url}`));
    }
}