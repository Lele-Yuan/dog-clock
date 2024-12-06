

exports.handleSchemeWakeup = (argv) => {
    const url = [].concat(argv).find((v) => v.startsWith(scheme))
    if (!url) return
    const searchParams = new URLSearchParams(url.slice(scheme.length))
    urlParams = Object.fromEntries(searchParams.entries())
    if (app.isReady()) createWindow()
};

// handleSchemeWakeup(process.argv)
// // 防止多次启动
// const gotTheLock = app.requestSingleInstanceLock()
// if (!gotTheLock) {
//     app.quit()
// } else {
//     app.on('second-instance', (event, argv) => {
//         // 从最小化窗口恢复
//         win.restore()
//         // 从后台显示
//         win.show()
//         handleSchemeWakeup(argv)

//         // // 如果发现 dog-clock:// 前缀，说明是通过 scheme 唤起
//         // const url = process.argv.find(v => v.startsWith(scheme))
//         // if (url) {
//         //     console.log('通过 scheme 唤起', url)
//         // }
//     })
// }

// app.on('open-url', (event, url) => handleSchemeWakeup(url))
