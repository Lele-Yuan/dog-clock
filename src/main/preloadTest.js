const { contextBridge, ipcRenderer } = require('electron')

const ipc = {
    render: {
        // From render to main.
        send: ["mainWindow:close", "mainWindow:maximize", "mainWindow:minimize", 'mainWindow:loadUrl', "checkForUpdate", "isUpdateNow", "checkAppVersion"],
        // From main to render.
        receive: ["updateAvailable", "message", "downloadProgress", "checking-for-update", "update-not-available", "isUpdateNow", "version"],
        // From render to main and back again.
        sendReceive: []
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
    doAThing: () => {
        console.log('I did a thing')
    }
})

// window.myAPI = {
//     doAThing: () => {
//         console.log('I did a thing')
//     }
// }
