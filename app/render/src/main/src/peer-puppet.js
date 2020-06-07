const { desktopCapturer } = window.require('electron');

async function getScreenStream() {
    const source = await desktopCapturer.getSources({ types: ['screen'] });
    return new Promise((resolve,reject)=>{
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

let candidates=[];

async function addIceCandidate(candidate) {
    if(candidate){
        candidates.push(candidate);
    }
    if (pc.remoteDescription && pc.remoteDescription.type) {
        for(let can of candidates){
            await pc.addIceCandidate(new RTCIceCandidate(can))
        }
        candidates=[];
    }
}

window.addIceCandidate=addIceCandidate;

let pc =new window.RTCPeerConnection()
async function createAnswer(offer){
    let screenStream= await getScreenStream();
    pc.addStream(screenStream)
    await pc.setRemoteDescription(offer);
    await pc.setLocalDescription(await pc.createAnswer())
    console.log('pc answer',JSON.stringify(pc.localDescription));

    return pc.localDescription;
}
window.createAnswer=createAnswer