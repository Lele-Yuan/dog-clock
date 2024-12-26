const { app, Menu } = require("electron");
const { checkUpdate } = require("./checkUpdate");
const path = require('path');

exports.createWindowMenus = () => {
    // 菜单栏模板
    console.log('app.name: ', app.name);
    const menuTemplate = [{
        label: app.name,
        submenu: [
            { label: '关于', accelerator: 'CmdOrCtrl+I', role: 'about' },
            {
                label: '检测更新',
                click: () => { checkUpdate() },
                accelerator: 'Command+Ctrl+U', // '这里可以设置快捷键',
                //   enabled: false // '这里设置是否可点击'
            },
            { label: '服务', role: 'services' },
            { type: 'separator' }, // 分割线
            { label: '隐藏 Dog-Clock', role: 'hide' },
            { label: '隐藏其他', role: 'hideOthers' },
            { type: 'separator' },
            { label: '退出', accelerator: 'Command+Q', role: 'quit' }
        ]
    },
    {
        label: '编辑',
        submenu: [
            { label: '复制', accelerator: 'CmdOrCtrl+C', role: 'copy' },
            { label: '粘贴', accelerator: 'CmdOrCtrl+V', role: 'paste' },
            { label: '剪切', accelerator: 'CmdOrCtrl+X', role: 'cut' },
            { label: '撤销', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
            { label: '重做', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
            { label: '全选', accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
        ]
    },
    {
        label: '窗口',
        role: 'window',
        submenu: [{
            label: '缩放',
            role: 'Zoom'
        }, {
            label: '最小化',
            role: 'minimize'
        }, {
            label: '关闭',
            role: 'close'
        }]
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [{
            label: '开发者工具',
            role: 'toggledevtools',
            accelerator: 'CommandOrControl+alt+i'
        }]
    }];
    // if (process.platform === 'darwin') {
    //     menuTemplate.unshift({ label: '' })
    // }
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
    app.dock.setMenu(menu)
}