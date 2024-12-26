const { ipcMain, BrowserWindow, nativeTheme, Menu } = require('electron');
const { themeColors } = require('./windowTheme');
const { createWindow } = require('./createWindow');
const { showNotification } = require('./notification');

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
    ipcMain.on('mainWindow:contextMenu', (_, arg) => {
        const contextMenu = Menu.buildFromTemplate([
            { label: '复制', role: 'copy' }
        ]);
        console.log('mainWindow:contextMenu: ');
        contextMenu.popup();
    })

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

    ipcMain.on("mainWindow:openMainNotification", (_) => {
        showNotification();
    });
};
