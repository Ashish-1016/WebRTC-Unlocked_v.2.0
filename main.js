let localStream;
let remoteStream;
let peerConnection;

//Initialse STUN Servers
let stunServers = {
    iceServers: [{
        urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
    }]
}



//Initialze Audio and Video from user

async function getUserAudioAndVideo() {
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true, audio: false
    })

    document.getElementById("user1").srcObject = localStream;


}







let init = async () => {

    //Step1:
    getUserAudioAndVideo()

    //Step2:


}

async function createOffer() {
    peerConnection = new RTCPeerConnection(stunServers)
    //Take remote stream only if peerConnection is initialised.
    remoteStream = new MediaStream()
    document.getElementById("user2").srcObject = remoteStream

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })

    peerConnection.ontrack = async = (e) => {
        e.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    //Setup ICE Candidates on the fly:
    //Basically updating the DOM every time ICE candidate is added/created.
    peerConnection.onicecandidate = async (e) => {
        if (e.candidate) {
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
        }
    }

    let offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    document.getElementById('offer-sdp').value = JSON.stringify(offer)

}

async function createAnswer() {

    peerConnection = new RTCPeerConnection(stunServers)
    //Take remote stream only if peerConnection is initialised.
    remoteStream = new MediaStream()
    document.getElementById("user2").srcObject = remoteStream

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })

    peerConnection.ontrack = async = (e) => {
        e.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    //Setup ICE Candidates on the fly:
    //Basically updating the DOM every time ICE candidate is added/created.
    peerConnection.onicecandidate = async (e) => {
        if (e.candidate) {
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)
        }
    }

    let offer = document.getElementById('offer-sdp').value
    if (!offer) return alert('Retrieve from offer from peer first')
    offer = JSON.parse(offer)
    await peerConnection.setRemoteDescription(offer)

    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    document.getElementById('answer-sdp').value = JSON.stringify(answer)

}


async function addAnswer() {
    let answer = document.getElementById('answer-sdp').value
    if (!answer) return alert("retrive answer from peer first")

    answer = JSON.parse(answer)
    if (!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer)
    }


}

init()

document.getElementById('create-offer').addEventListener('click', createOffer)
document.getElementById('create-answer').addEventListener('click', createAnswer)
document.getElementById('add-answer').addEventListener('click', addAnswer)