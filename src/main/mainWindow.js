const path = require('path');
const { BrowserWindow, screen, nativeTheme } = require('electron');
// const { checkUpdate } = require('./checkUpdate');
const { themeColors } = require('./windowTheme');

exports.initMainWindow = () => {
    let urlParams = {}
    let win

    const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
    // 获取屏幕的宽度
    // 定义窗口的宽度
    const windowWidth = 1100;
    const windowheight = 900;
    // 计算窗口的初始 x 坐标（屏幕宽度 - 窗口宽度）
    // const initialX = screenWidth - windowWidth;

    const width = parseInt(urlParams.width) || windowWidth
    const height = parseInt(urlParams.height) || windowheight
    if (win) {
        win.setSize(width, height)
    } else {
        win = new BrowserWindow({
            width,
            height, // 设置窗口宽高
            // x: initialX,
            // y: 0, // 设置窗口的初始位置为右上角
            // resizable: false, // 不允许用户调整窗口大小
            minWidth: 800,
            minHeight: 600,
            // simpleFullscreen: true,
            backgroundColor: themeColors[nativeTheme.themeSource].backgroundColor, // 设置窗口的背景色
            // titleBarStyle: 'hiddenInset', // 隐藏标题栏
            // titleBarStyle: 'hidden',
            // trafficLightPosition: { x: 100, y: 100 },
            // frame: true, // 隐藏标题栏
            skipTaskbar: true,
            // fullscreenable: false,
            enableLargerThanScreen: true,
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

        setTimeout(() => {
            console.log('向渲染进程发送消息: ', win.webContents.id);
            win.webContents.send('message:something', '你好！我是主进程！')
        }, 1000);

    }
};