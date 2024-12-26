const path = require('path');
const { BrowserWindow, screen, nativeTheme, ipcMain } = require('electron');
const { themeColors } = require('./windowTheme');

let childWin = null;
const createModalWindow = (win) => {
    childWin = new BrowserWindow({
        parent: win,
        modal: true,
        show: false,
        frame: true,
    })
    childWin.loadURL('https://github.com/Lele-Yuan/dog-clock')
    childWin.once('ready-to-show', () => {
        childWin.show()
    })

    // 因为parent是frameless窗口，所以子窗口没有控制按钮，所以当模态框失去焦点时该关闭
    childWin.on('blur', () => {
        // 当模态框失去焦点时关闭模态和蒙层
        if (childWin) childWin.close();
    });
}

const initIpcMainListener = (win) => {
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
    ipcMain.on('mainWindow:getTheme', (event) => {
        console.log('接收到了来自 nativeTheme.themeSource: ', event.sender);
        console.log('nativeTheme.themeSource: ', nativeTheme.themeSource);
        //主进程发送消息给渲染进程
        win.webContents.send('message:theme', nativeTheme.themeSource)
    });
    ipcMain.on('mainWindow:openModal', () => {
        createModalWindow(win)
    });
}

exports.initFramelessWindow = () => {
    let win

    const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
    // 获取屏幕的宽度
    // 定义窗口的宽度
    const width = 1100
    const height = 900

    // 计算窗口的初始 x 坐标（屏幕宽度 - 窗口宽度）
    const initialX = screenWidth - width;

    if (win) {
        win.setSize(width, height)
    } else {
        win = new BrowserWindow({
            width,
            height, // 设置窗口宽高
            x: initialX,
            y: 0, // 设置窗口的初始位置为右上角
            resizable: false, // 不允许用户调整窗口大小
            minWidth: 800,
            minHeight: 600,
            backgroundColor: themeColors[nativeTheme.themeSource].backgroundColor, // 设置窗口的背景色
            // titleBarStyle: 'hiddenInset', // 隐藏标题栏
            frame: false, // 隐藏标题栏
            // enableLargerThanScreen: true, // 允许窗口大于屏幕
            webPreferences: {
                webviewTag: true, // 需要添加webviewTag属性,否则 webview 标签无法使用
                contentSecurityPolicy: `style-src`,
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

    // 主进程监听渲染进程的消息
    initIpcMainListener(win);
    
};