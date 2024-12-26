const { app, Menu, Tray, BrowserWindow, ipcMain } = require("electron");
const path = require('path');
const { createRemindWindow } = require('./remindWindow');
const { iconPathLittle } = require("./constant");
let remindWin;
exports.listenRemind = (tray) => {
        
    function checkTimeAndNotify() {
        // 获取当前时间
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // 检查当前时间是否为晚上8点（20:00）
        if (hours === 17 && minutes === 47 && !remindWin) {
            console.log('hours: ', hours, 'minutes: ', minutes, 'remindWin: ', remindWin);
            const { x, y, width, height } = tray?.getBounds()
            console.log('createRemindWindow x, y: ', x, y); // 这里不清楚为啥是 x, y:  0 982
            remindWin = createRemindWindow(tray)
            remindWin.setPosition(x - (200 - width) / 2, height)

            global.remindWin = remindWin

            remindWin.on('closed', () => { global.remindWin = null })
        }
    }

    // 设置一个定时器，每分钟检查一次时间
    timmer = setInterval(checkTimeAndNotify, 20000);
    // 立即调用一次，以防程序恰好在8点启动
    checkTimeAndNotify();
    
}

exports.createWindowTray = (windowAllClostCallback) => {
    
    // 实例化 tray 对象，需要在托盘中显示的图标url作为参数
    // 确保路径和格式正确，建议使用 16x16 像素到 32x32 像素的图标
    const tray = new Tray(iconPathLittle);

    const { x, y, width, height } = tray.getBounds()
    console.log('tray x, y: ', x, y, width, height);
    
    this.listenRemind(tray) // 监听提醒时间，创建提醒窗口


    ipcMain.on('mainWindow:openTrayNotification', (_, arg) => {
        if (remindWin || !tray) return
        const { x, width, height } = tray?.getBounds();
        remindWin = createRemindWindow(tray)
        remindWin.setPosition(x - (200 - width) / 2, height)
    })
    ipcMain.on('mainWindow:closeRemind', (_) => {
        remindWin?.close();
        remindWin = null;
    });
    
    // 点击托盘图标的事件，根据窗口的显示状态切换主窗口的显示和隐藏
    tray.on('click', () => {
        let windows = BrowserWindow.getAllWindows();
        windows.forEach(win => {
            if(win.isVisible()){
                win.hide()
            }else{
                console.log('win.show: ');
                win.show()
            }
        })

    })

    const contextMenu = Menu.buildFromTemplate([
        { label: '退出', click: () => { app.quit() } }
    ])

    // 设置右键托盘图标时的菜单，这里设置为只有一个退出选项
    tray.on('right-click', () => {
        tray.popUpContextMenu(contextMenu)
    })
    
    // 给托盘对象设置菜单，点击和右键时都会显示这个菜单
    // tray.setContextMenu(contextMenu)
    // 设置鼠标移到托盘中的图标上时显示的文本
    tray.setToolTip('这是一个小狗闹钟');

    windowAllClostCallback.push(() => {
        tray.destroy()
    })
}