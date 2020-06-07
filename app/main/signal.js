const WebSocket = require('ws');
const EventEmitter = require('events');

const signal = new EventEmitter();

const ws = new WebSocket('ws://127.0.0.1:8089');
ws.on('open', () => {
    console.log('connect success')
});

ws.on('message', function incoming(message) {
    let data = JSON.parse(message)
    console.log('data', data, message);
    signal.emit(data.event, data.data)
})

function invoke(event, data, answerEvent) {
    return new Promise((resolve, reject) => {
        send(event, data)
        signal.once(answerEvent, resolve)
        // setTimeout(() => {
        //     reject('timeout')
        // }, 5000)
    })
}

function send(event, data) {
    console.log(JSON.stringify({event, data}));
    ws.send(JSON.stringify({event, data}));
}

signal.send = send;
signal.invoke=invoke;

module.exports = signal