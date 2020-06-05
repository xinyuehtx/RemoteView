const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const handleIPC = require('./ipc');
// const {create} = require('./windows/main');
const{create:createControlWindow}=require('./windows/control')



app.on('ready', () => {
    createControlWindow();

    handleIPC();
});