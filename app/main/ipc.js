const { ipcMain } = require("electron")
const{send:sendMainWindow}=require('./windows/main')
const{create:createControlWindow}=require('./windows/control')

module.exports = function () {
    ipcMain.handle('login', async () => {
        let code = Math.floor(Math.random() * (999999 - 100000) + 100000);
        return code;
    })

    ipcMain.on('control', async (e, remoteCode) => {
        sendMainWindow('control-state-change', remoteCode, 1);
        createControlWindow();
    })
}