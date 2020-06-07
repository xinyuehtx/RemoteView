const { desktopCapturer, ipcRenderer } = window.require('electron');

async function getScreenStream() {
    const source = await desktopCapturer.getSources({ types: ['screen'] });
    return new Promise((resolve, reject) => {
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
            resolve(stream);
            // peer.emit('add-stream', stream);
        }, (err) => {
            //handle error
            console.error(err);
        })
    })

}

let pc = new window.RTCPeerConnection()


pc.onicecandidate = function (e) {
    if (e.candidate) {
        ipcRenderer.send('forward', 'puppet-candidate', JSON.stringify(e.candidate));
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

window.addIceCandidate = addIceCandidate;

ipcRenderer.on('offer', async (e, offer) => {
    let answer = await createAnswer(offer);
    ipcRenderer.send('forward', 'answer', { type: answer.type, sdp: answer.sdp })
}
)

async function createAnswer(offer) {
    let screenStream = await getScreenStream();
    pc.addStream(screenStream)
    await pc.setRemoteDescription(offer);
    await pc.setLocalDescription(await pc.createAnswer())
    console.log('pc answer', JSON.stringify(pc.localDescription));

    return pc.localDescription;
}
window.createAnswer = createAnswer