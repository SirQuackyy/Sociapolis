if (!location.hash) {
    location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
  }
  const roomHash = location.hash.substring(1);

  const drone = new ScaleDrone('FRtFMi91zAmFRMrp');
  const roomName = 'observable-' + roomHash;
  const configuration = {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  };
  let room;
  let pc;
    
    
  function onSuccess() {};
  function onError(error) {
    console.error(error);
  };
    
  drone.on('open', error => {
    if (error) {
      return console.error(error);
    }
    room = drone.subscribe(roomName);
    room.on('open', error => {
      if (error) {
        onError(error);
      }
    });
    room.on('members', members => {
      console.log('MEMBERS', members);
      const isOfferer = members.length === 2;
      startWebRTC(isOfferer);
    });
  });
    
  function sendMessage(message) {
    drone.publish({
      room: roomName,
      message
    });
  }
    
  function startWebRTC(isOfferer) {
    pc = new RTCPeerConnection(configuration);
    
    pc.onicecandidate = event => {
      if (event.candidate) {
        sendMessage({'candidate': event.candidate});
      }
    };
    
    if (isOfferer) {
      pc.onnegotiationneeded = () => {
        pc.createOffer().then(localDescCreated).catch(onError);
      }
    }
    
    pc.onaddstream = event => {
      remoteVideo.srcObject = event.stream;
    };
    
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    }).then(stream => {
      localVideo.srcObject = stream;
      pc.addStream(stream);
    }, onError);
    
    room.on('data', (message, client) => {
      if (client.id === drone.clientId) {
        return;
      }
    
      if (message.sdp) {
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
          if (pc.remoteDescription.type === 'offer') {
            pc.createAnswer().then(localDescCreated).catch(onError);
          }
        }, onError);
      } else if (message.candidate) {
        pc.addIceCandidate(
          new RTCIceCandidate(message.candidate), onSuccess, onError
        );
      }
    });
  }
    
  function localDescCreated(desc) {
    pc.setLocalDescription(
      desc,
      () => sendMessage({'sdp': pc.localDescription}),
      onError
    );
  }
