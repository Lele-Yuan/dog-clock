const { app, Menu, Tray } = require("electron");
const path = require('path');

exports.createWindowTray = (win) => {
    // 确保路径和格式正确，建议使用 16x16 像素或 32x32 像素的图标
    const iconPath = path.join(__dirname, '../../build/icons/32x32.png')

    // 实例化 tray 对象，需要在托盘中显示的图标url作为参数
    const tray = new Tray(iconPath);
    
    // 点击托盘图标的事件，根据窗口的显示状态切换主窗口的显示和隐藏
    tray.on('click', () => {
        if(win.isVisible()){
            win.hide()
        }else{
            console.log('win.show: ');
            win.show()
        }
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
}