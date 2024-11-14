const path = require('path');
const { app, BrowserWindow } = require('electron');
const { checkUpdate } = require('./checkUpdate');

let mainWindow

const protocol = 'electron-app'
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

        // // 如果发现 electron-app:// 前缀，说明是通过 scheme 唤起
        // const url = process.argv.find(v => v.startsWith(scheme))
        // if (url) {
        //     console.log('通过 scheme 唤起', url)
        // }
    })
}

app.on('open-url', (event, url) => handleSchemeWakeup(url))

app.whenReady().then(() => {
    createWindow();
    checkUpdate();
})

function createWindow() {
    const width = parseInt(urlParams.width) || 800
    const height = parseInt(urlParams.height) || 600
    if (mainWindow) {
        mainWindow.setSize(width, height)
    } else {
        mainWindow = new BrowserWindow({
            width,
            height,
            webPreferences: {
                webviewTag: true, // 需要添加webviewTag属性,否则webview标签无法使用
            },
        })
        // mainWindow.loadURL('https://juejin.cn/user/4476867080110957')
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
    }
}

function handleSchemeWakeup(argv) {
    const url = [].concat(argv).find((v) => v.startsWith(scheme))
    if (!url) return
    const searchParams = new URLSearchParams(url.slice(scheme.length))
    urlParams = Object.fromEntries(searchParams.entries())
    if (app.isReady()) createWindow()
}
