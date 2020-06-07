const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8089 })
const code2ws = new Map();

wss.on('connection', (ws, req) => {
    let code = Math.floor(Math.random() * (999999 - 100000) + 100000);
    code2ws.set(code, ws);

    ws.sendData = (event, data) => {
        ws.send(JSON.stringify({event, data}));
    };
    ws.sendError = msg => {
        ws.sendData('error', {msg})
    };
    ws.on('message', function incoming(message) {
        console.log('imcoming', message);
        let parsedMessage = {};
        try {
            parsedMessage = JSON.parse(message);
        } catch (e) {
            ws.send('message invalid');
            console.log('parse message error', e)
        }

        let { event, data } = parsedMessage;
        if (event === 'login') {
            ws.sendData( 'logined', {code})
        } 
        else if (event === 'control') {
            let remote = +data.remote;
            if (code2ws.has(remote)) {
                ws.sendData('controlled', { remote });
                let remoteWS = code2ws.get(remote)
                ws.sendRemote = remoteWS.sendData
                remoteWS.sendRemote = ws.sendData
                ws.sendRemote('be-controlled', { remote: code })
            }
        }
        else if (event === 'forward') {
            ws.sendRemote(data.event, data.data)
        }
        else {
            ws.sendError('message not handle', message)
        }
    });

    ws.on('close', (code) => {
        code2ws.delete(code);
        delete ws.sendRemote
        clearTimeout(ws._closeTimeout)
    });

    ws._closeTimeout = setTimeout(() => {
        ws.terminate()
    }, 10 * 60 * 1000);

})