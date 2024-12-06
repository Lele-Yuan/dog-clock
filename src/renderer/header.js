window.onload = () => {
    const { ipcRendererSend } = window.electron;
    const closeDom = document.querySelector('#control-buttons-close')
    closeDom.addEventListener('click', (e) => {
        ipcRendererSend('mainWindow:close')
    })
    const maximizeDom = document.querySelector('#control-buttons-maximize')
    maximizeDom.addEventListener('click', (e) => {
        ipcRendererSend('mainWindow:maximize')
    })
    const minimizeDom = document.querySelector('#control-buttons-minimize')
    minimizeDom.addEventListener('click', (e) => {
        ipcRendererSend('mainWindow:minimize')
    })
}