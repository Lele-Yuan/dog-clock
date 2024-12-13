const path = require('path');
const { ipcMain, screen, BrowserWindow, nativeTheme } = require('electron');
const { themeColors } = require('./windowTheme');

function createWindow({
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
    }
}

const changeAllWindowTheme = () => {
    let windows = BrowserWindow.getAllWindows();
    windows.forEach(win => {
        console.log('changeAllWindowTheme nativeTheme.themeSource: ', nativeTheme.themeSource);
        win.setBackgroundColor(themeColors[nativeTheme.themeSource].backgroundColor);
        // if (win.webContents !== event.sender) { // 不改变消息发送者窗口的背景色
        // }
        win.webContents.send('message:changeTheme', nativeTheme.themeSource);
    });
};

exports.handleIpcMain = () => {
    ipcMain.on('mainWindow:loadUrl', (_, url) => {
        console.log('mainWindow:loadUrl: ', url);
        createWindow({url})
    });

    ipcMain.handle("mainWindow:changeTheme", (_, type) => {
        console.log('mainWindow:changeTheme type: ', type);
        nativeTheme.themeSource = type;
        
        changeAllWindowTheme();
        
        return nativeTheme.themeSource;
    });

    ipcMain.handle("mainWindow:windowsCount", (_) => {
        const windows = BrowserWindow.getAllWindows()
        
        console.log('mainWindow:windowsCount: ', windows.length);
        return windows.length;
    });
};

exports.initIpcMainListener = (win) => {
    ipcMain.on('mainWindow:close', () => {
        console.log('mainWindow:close: ');
        win.close();
    });
    ipcMain.on('mainWindow:maximize', () => {
        console.log('mainWindow:maximize: ');
        win.setFullScreen(!win.isFullScreen());
    });
    ipcMain.on('mainWindow:minimize', () => {
        console.log('mainWindow:minimize: ');
        win.minimize();
    });
    ipcMain.on('mainWindow:closeRemind', (event) => {
        const remindWin = global.remindWin;
        console.log('mainWindow:closeRemind: ', remindWin);
        BrowserWindow.fromId(remindWin.id)?.close();
    });
    ipcMain.on('mainWindow:getTheme', (event) => {
        console.log('接收到了来自 nativeTheme.themeSource: ', event.sender);
        console.log('nativeTheme.themeSource: ', nativeTheme.themeSource);
        //主进程发送消息给渲染进程
        win.webContents.send('message:theme', nativeTheme.themeSource)
    });
};
