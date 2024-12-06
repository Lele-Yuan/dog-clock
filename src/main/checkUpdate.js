const { dialog } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')
const isDev = import('electron-is-dev');

// 定义返回给渲染层的相关提示文案
const message = {
    title: '检查更新',
    tips: '发现新版本，是否更新？',
    error: '检查更新异常',
    checking: '正在检查更新……',
    updateAva: '检测到新版本，正在下载……',
    updateNotAva: '现在使用的就是最新版本，不用更新',
};

autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

// 这里是为了在本地做应用升级测试使用
if (isDev) {
    autoUpdater.forceDevUpdateConfig = true;
    console.log('__dirname: ', __dirname);
    autoUpdater.updateConfigPath = path.join(__dirname, './dev-app-update.yml');

    // 默认会自动下载新版本，如果不想自动下载，设置autoUpdater.autoDownload = false
    // 设置自动下载为false，这样就不会自动下载
    autoUpdater.autoDownload = false;
    autoUpdater.setFeedURL({
        provider: 'generic',
        url: 'http://localhost:8060/'
    });
}

function checkUpdate() {
    // 主进程跟渲染进程通信
    // const sendUpdateMessage = (text) => {
    //     // 发送消息给渲染进程
    //     win.webContents.send('message', text);
    // };

    // 检测更新
    autoUpdater.checkForUpdates();

    // 检测是否需要更新
    autoUpdater.on('checking-for-update', () => {
        console.log(`${message.checking}`)
    });

    // 监听'error'事件
    autoUpdater.on('error', (error) => {
        console.log(`${message.error}:${error}`)
    })

    // 检测到不需要更新时
    autoUpdater.on('update-not-available', () => {
        console.log(`${message.updateNotAva}`)
    });

    // 监听'update-available'事件，发现有新版本时触发
    autoUpdater.on('update-available', () => {
        dialog.showMessageBox({
            type: 'info',
            title: message.title,
            message: message.tips,
            buttons: ['是', '否']
        }).then((buttonIndex) => {
            if (buttonIndex.response == 0) {  //选择是，则退出程序，安装新版本
                // 下载更新
                autoUpdater.downloadUpdate();
            }
        })
    })

    // 更新下载进度
    autoUpdater.on('download-progress', (progress) => {
        // 直接把当前的下载进度发送给渲染进程即可，有渲染层自己选择如何做展示
        // win.webContents.send('downloadProgress', progress);
        console.log(`下载进度：${progress}`);
    });

    // 监听'update-downloaded'事件，新版本下载完成时触发
    autoUpdater.on('update-downloaded', () => {
        // 给用户一个提示，然后重启应用；或者直接重启也可以，只是这样会显得很突兀
        dialog.showMessageBox({
            title: '安装更新',
            message: '更新下载完毕，应用将重启并进行安装'
        }).then((res) => {
            console.log('安装更新', res);
            // 退出并安装应用
            // setTimeout(() => autoUpdater.quitAndInstall());
            // autoUpdater.quitAndInstall();
        });
    })
}

exports.checkUpdate = checkUpdate;