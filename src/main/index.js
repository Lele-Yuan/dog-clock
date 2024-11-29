const path = require('path');
const { app, BrowserWindow, screen } = require('electron');
const { checkUpdate } = require('./checkUpdate');

let mainWindow

const protocol = 'dog-clock'
const scheme = `${protocol}://`
// 注册协议
app.setAsDefaultProtocolClient(protocol);

let urlParams = {}

handleSchemeWakeup(process.argv)
// 防止多次启动
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, argv) => {
        // 从最小化窗口恢复
        mainWindow.restore()
        // 从后台显示
        mainWindow.show()
        handleSchemeWakeup(argv)

        // // 如果发现 dog-clock:// 前缀，说明是通过 scheme 唤起
        // const url = process.argv.find(v => v.startsWith(scheme))
        // if (url) {
        //     console.log('通过 scheme 唤起', url)
        // }
    })
}

app.on('open-url', (event, url) => handleSchemeWakeup(url))

function createWindow() {

    // 获取屏幕的宽度
    const screenWidth = screen.getPrimaryDisplay().workAreaSize.width;
    // 定义窗口的宽度
    const windowWidth = 800; // 根据你的需求设置窗口宽度
    // 计算窗口的初始 x 坐标（屏幕宽度 - 窗口宽度）
    const initialX = screenWidth - windowWidth;

    const width = parseInt(urlParams.width) || windowWidth
    const height = parseInt(urlParams.height) || 600
    if (mainWindow) {
        mainWindow.setSize(width, height)
    } else {
        mainWindow = new BrowserWindow({
            width,
            height, //设置窗口宽高
            // x: initialX,
            // y: 0,
            // resizable: true,
            // backgroundColor: '#2e2c29',
            // // titleBarStyle: 'hidden',
            // // frame: false,
            // fullscreenable: false,
            // icon: __dirname + '../../build/icons/icon',
            // hiddenInMissionControl: true,
            // title: 'anc',
            // vibrancy: 'appearance-based',
            webPreferences: {
                // webviewTag: true, // 需要添加webviewTag属性,否则webview标签无法使用
                contentSecurityPolicy: `style-src`,
            },
        })
        // mainWindow.loadURL('https://juejin.cn/user/4476867080110957')
        mainWindow.loadFile(path.join(__dirname, '../renderer/helloworld.html'))
    }
}

function handleSchemeWakeup(argv) {
    const url = [].concat(argv).find((v) => v.startsWith(scheme))
    if (!url) return
    const searchParams = new URLSearchParams(url.slice(scheme.length))
    urlParams = Object.fromEntries(searchParams.entries())
    if (app.isReady()) createWindow()
}

app.whenReady().then(() => {
    createWindow();
    checkUpdate();
})