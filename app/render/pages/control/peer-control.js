const EventEmitter = require('events');
const peer = new EventEmitter();
const { desktopCapturer } = require('electron');

async function getScreenStream() {
    const source = await desktopCapturer.getSources({ types: ['screen'] });

    navigator.webkitGetUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source[0].id,
                maxWidth: window.screen.width,
                maxHeight: window.screen.height,
            }
        }
    }, (stream) => {
        peer.emit('add-stream', stream);
    }, (err) => {
        //handle error
        console.error(err);
    })
}


getScreenStream();
module.exports = peer;