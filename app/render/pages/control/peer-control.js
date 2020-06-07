const EventEmitter = require('events');
const peer = new EventEmitter();
const { ipcRenderer, desktopCapturer } = require('electron');

peer.on('robot', (type, data) => {
    if (type === 'mouse') {
        data.screen = { width: window.screen.width, height: window.screen.height }
    }

    ipcRenderer.send('robot', type, data);
});
const pc = new window.RTCPeerConnection();

pc.onicecandidate = function (e) {
    if (e.candidate) {
        ipcRenderer.send('forward', 'control-candidate', e.candidate)
    }
}

ipcRenderer.on('candidate', (e, candidate) => {
    addIceCandidate(candidate);
})

let candidates = [];

async function addIceCandidate(candidate) {
    if (candidate) {
        candidates.push(candidate);
    }
    if (pc.remoteDescription && pc.remoteDescription.type) {
        for (let can of candidates) {
            await pc.addIceCandidate(new RTCIceCandidate(can))
        }
        candidates = [];
    }
}


async function createOffer() {
    const offer = await pc.createOffer({
        offerToReceiveAudio: false,
        offerToReceiveVideo: true,
    })

    await pc.setLocalDescription(offer);
    console.log('pc offer', JSON.stringify(offer));
    return pc.localDescription;
}
createOffer().then(offer => {
    ipcRenderer.send('forward', 'offer', { type: offer.type, sdp: offer.sdp });
})
async function setRemote(answer) {
    await pc.setRemoteDescription(answer);
}

ipcRenderer.on('answer', (e, answer) => {
    setRemote(answer);
})

pc.onaddstream = (e) => {
    peer.emit('add-stream', e.stream);
}
module.exports = peer;