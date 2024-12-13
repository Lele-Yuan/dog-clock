const path = require('path');
const { BrowserWindow, nativeTheme} = require("electron");
const { remindWindowWidth, remindWindowHeight } = require('./constant');
const { themeColors } = require('./windowTheme');

exports.createRemindWindow = function() {
    const win = new BrowserWindow({
        width: remindWindowWidth,
        height: remindWindowHeight,
        // x: y - (windowWidth - width) / 2,
        // y: x,
        // useContentSize: false,
        backgroundColor: themeColors[nativeTheme.themeSource].backgroundColor,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        // webPreferences: {
        //     nodeIntegration: false,
        //     contextIsolation: true,
        //     enableRemoteModule: false,
        //     preload: path.join(__dirname, 'preload.js')
        // },
    });
    const urlLocation = `file://${path.join(__dirname, '../renderer/remind.html')}`

    win.loadURL(urlLocation);

    return win
};
