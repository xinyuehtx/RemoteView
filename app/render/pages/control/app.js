const peer = require('./peer-control');
peer.on('add-stream', (stream) => {
    play(stream);
});


function play(stream) {
    let video = document.getElementById('screen-video');
    video.srcObject = stream;
    video.onloadedmetadata = function () {
        video.play();
    }
}