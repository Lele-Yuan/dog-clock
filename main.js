const { app, BrowserWindow, ipcMain, dialog, nativeTheme } = require('electron');
const path = require('path');
// const fs = require('fs');
const isDev = import('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const { themeColors } = require('./src/main/windowTheme');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 802,
        height: 824,
        backgroundColor: themeColors[nativeTheme.themeSource].backgroundColor,
        useContentSize: false,
        // frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        },
    });

    if (isDev) {
        // win.webContents.openDevTools();
    }

    const urlLocation = `file://${path.join(__dirname, './src/renderer/index.html')}`

    win.loadURL(urlLocation);

    win.on('closed', () => {
        win = null
    });

    return win;
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

// let updaterCacheDirName = 'electron-admin-updater'
// const updatePendingPath = path.join(autoUpdater.app.baseCachePath, updaterCacheDirName, 'pending')
// fs.emptyDir(updatePendingPath);

// const feedUrl = `http://localhost:2060`; // 更新包位置
// autoUpdater.setFeedURL({
//     provider: 'generic',
//     url: feedUrl
// });
// autoUpdater.setFeedURL({
//     provider: 'github',
//     repo: 'electron-demo',
//     owner: 'myadmin',
//     private: true,
//     token: ''
// });

const message = {
    error: '检查更新出错',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
};

if (isDev) {
    autoUpdater.forceDevUpdateConfig = true;
    autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
}
autoUpdater.autoDownload = false;
// autoUpdater.checkForUpdates();
autoUpdater.on('error', (error) => {
    // dialog.showErrorBox('Error', err === null ? 'unknown' : err);
    sendUpdateMessage(`${message.error}:${error}`);
});
autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
    // win.webContents.send('checking-for-update', 'Checking for update...');
    sendUpdateMessage(message.checking);
});
autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
        type: 'info',
        title: '应用有新的更新',
        message: '发现新版本，是否现在更新？',
        buttons: ['是', '否']
    }).then(({ response }) => {
        if (response === 0) {
            // win.webContents.send('updateAvailable', '点击了是');
            autoUpdater.downloadUpdate();
            sendUpdateMessage(message.updateAva);
        }
    });

    // autoUpdater.downloadUpdate();
    // sendUpdateMessage(message.updateAva);
});
autoUpdater.on('update-not-available', () => {
    // dialog.showMessageBox({
    //     title: '没有新版本',
    //     message: '当前已经是最新版本'
    // });
    // win.webContents.send('update-not-available', '没有新版本');
    sendUpdateMessage(message.updateNotAva);
});
autoUpdater.on('download-progress', (progress) => {
    let logMessage = `Download speed: ${progress.bytesPerSecond}`;
    logMessage = logMessage + ' - Download ' + progress.percent + '%';
    logMessage = logMessage + ' (' + progress.transferred + '/' + progress.total + ')';
    console.log(logMessage);
    win.webContents.send('downloadProgress', progress);
    win.setProgressBar(progress.percent / 100);
});
autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        title: '安装更新',
        message: '更新下载完毕，应用将重启并进行安装'
    }).then(() => {
        setImmediate(() => autoUpdater.quitAndInstall());
    });
});

// autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
//     console.log('更新完成')
//     ipcMain.on('isUpdateNow', (e, arg) => {
//         console.log('开始更新');
//         //some code here to handle event
//         autoUpdater.quitAndInstall();
//     });

//     win.webContents.send('isUpdateNow')
// });

ipcMain.on('render-send', (event, arg) => {
    // console.log('event', event);
    console.log('arg', arg);
    dialog.showOpenDialog(win, {
        properties: ['openFile', 'openDirectory']
    }).then(result => {
        console.log(result.canceled)
        console.log(result.filePaths)
        win.webContents.send('ping', {
            canceled: result.canceled,
            filePaths: result.filePaths
        });
    }).catch(err => {
        console.log(err)
    });
    // dialog.showMessageBox({
    //     type: 'info',
    //     title: '应用有新的更新',
    //     message: '发现新版本，是否现在更新？',
    //     buttons: ['是', '否']
    // }).then(({ response }) => {
    //     if (response === 0) {
    //         win.webContents.send('updateAvailable', '点击了是');
    //         sendUpdateMessage(message.updateAva);
    //         autoUpdater.downloadUpdate();
    //     }
    // });
});

ipcMain.on('checkForUpdate', () => {
    console.log('checkForUpdate: ');
    //放外面的话启动客户端执行自动更新检查
    autoUpdater.checkForUpdates();
});

function sendUpdateMessage(text) {
    win.webContents.send('message', text)
}

ipcMain.on('checkAppVersion', () => {
    win.webContents.send('version', app.getVersion());
});