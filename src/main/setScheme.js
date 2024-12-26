const path = require('path');
const { app } = require("electron");
const { protocol, scheme } = require("./constant");
const { createWindow } = require("./createWindow");

// 通过 scheme 唤起应用，并打开相应页面
// dog-clock://helloworld?width=1280&height=700&url=https://baidu.com
const handleSchemeWakeup = (argv) => {
    const url = [].concat(argv).find((v) => v.startsWith(scheme))
    if (!url) return
    const searchParams = new URLSearchParams(url.slice(scheme.length))
    urlParams = Object.fromEntries(searchParams.entries())
    console.log('urlParams: ', searchParams, urlParams);

    const { width, height, url: pageUrl = path.join(__dirname, '../renderer/helloworld.html') } = urlParams

    if (app.isReady()) createWindow({
        width: Number(width),
        height: Number(height),
        url: pageUrl,
    })
};

exports.initScheme = () => {
    // 注册协议
    app.setAsDefaultProtocolClient(protocol);

    // 命令行参数
    handleSchemeWakeup(process.argv)
    
    // 通过 scheme 唤起应用 macOS 监听 open-url 事件，windows 和 linux 平台监听 second-instance 事件
    app.on('open-url', (_, url) => {
        console.log('open-url: ', url);
        handleSchemeWakeup(url)
    })

    // 防止多次启动
    const gotTheLock = app.requestSingleInstanceLock()
    console.log('gotTheLock: ', gotTheLock);
    if (!gotTheLock) {
        console.log('不能启动多个实例')
        app.quit()
    } else {
        app.on('second-instance', (_, commandLine) => {
            const win = BrowserWindow.getAllWindows()[0] // 获取当前窗口
            // 从最小化窗口恢复
            win.restore()
            // 从后台显示
            win.show()
            handleSchemeWakeup(commandLine)
    
            // windows 平台获取命令行参数，如果发现 dog-clock:// 前缀，说明是通过 scheme 唤起
            const url = process.argv.find(v => v.startsWith(scheme))
            if (url) {
                console.log('通过 scheme 唤起', url)
            }
        })
    }
}
