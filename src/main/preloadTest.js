const { contextBridge, ipcRenderer } = require('electron')

const ipc = {
    render: {
        // From render to main.
        send: ["mainWindow:close", "mainWindow:maximize", "mainWindow:minimize", 'mainWindow:loadUrl', "mainWindow:getTheme", "mainWindow:closeRemind", "mainWindow:contextMenu", "mainWindow:openModal", "mainWindow:openTrayNotification", "mainWindow:openMainNotification", "checkForUpdate", "isUpdateNow", "checkAppVersion"],
        // From main to render.
        receive: ["updateAvailable", "message", "downloadProgress", "checking-for-update", "update-not-available", "isUpdateNow", "version", 'message:theme', 'message:something', "message:changeTheme"],
        // From render to main and back again.
        sendReceive: ["mainWindow:changeTheme", "mainWindow:windowsCount"]
    }
};
contextBridge.exposeInMainWorld('electron', {
    ipcRendererSend: (channel, data) => {
        // whitelist channels
        let validChannels = ipc.render.send;
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    ipcRendereReceive: (channel, func) => {
        let validChannels = ipc.render.receive;
        // console.log('validChannels', validChannels);
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.on(`${channel}`, (event, ...args) => func(...args));
        }
    },
    ipcRendereInvoke: (channel, args) => {
        let validChannels = ipc.render.sendReceive;
        if (validChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, args);
        }
    },
    doAThing: () => {
        console.log('I did a thing')
    }
})

// window.myAPI = {
//     doAThing: () => {
//         console.log('I did a thing')
//     }
// }
