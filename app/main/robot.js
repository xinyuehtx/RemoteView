const { ipcMain } = require('electron');
const robot = require('robotjs');
const vkey = require('vkey');

function handleMouse(data) {
    let x = data.clientX * data.screen.width / data.video.width;
    let y = data.clientY * data.screen.height / data.video.height;
    robot.moveMouse(x, y);
    robot.mouseClick();
}

function handleKey(data) {
    const modifies = [];
    if (data.meta) {
        modifies.push('meta');
    }
    if (data.shift) {
        modifies.push('shift');
    }
    if (data.alt) {
        modifies.push('alt');
    }
    if (data.ctrl) {
        modifies.push('ctrl');
    }

    let key = vkey[data.keyCode].toLowerCase();
    if (key[0] !== '<') {
        robot.keyTap(key, modifies);
    }
}


module.exports = function () {
    ipcMain.on('robot', (e, type, data) => {
        if (type === 'mouse') {
            handleMouse(data);
        }
        else if (type === 'key') {
            handleKey(data);
        }
    })
}