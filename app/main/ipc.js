const { ipcMain } = require("electron")
const { send: sendMainWindow } = require('./windows/main')
const { create: createControlWindow } = require('./windows/control')

const signal = require('./signal');

module.exports = function () {
    ipcMain.handle('login', async () => {
        let {code} = await signal.invoke('login', null, 'logined')
        return code
    })

    ipcMain.on('control', async (e, remoteCode) => {
        signal.send('control',{remote:remoteCode})
        
    })

    signal.on('controlled',(data)=>{
        sendMainWindow('control-state-change', data.remote, 1);
        createControlWindow();
    })

    signal.on('be-controlled',(data)=>{
        sendMainWindow('control-state-change', data.remote, 2);
    })
}