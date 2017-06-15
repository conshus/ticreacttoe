import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import base from '../rebase';

var servers = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}, {'url': 'turn:numb.viagenie.ca','credential': 'webrtc','username': 'ourshowthrowaway@gmail.com'}]};
var yourId = Math.floor(Math.random()*1000000000);
var pc = new RTCPeerConnection(servers);


class WebRTC extends Component {
  constructor (props){
    super(props);
    this.state ={
      WebRTC:{}
    }
  }





  componentDidMount(){

    console.log(this.props.gameId)
    // base.syncState(`game/${this.props.gameId}/WebRTC`, {
    //   context: this,
    //   state: 'WebRTC',
    //   asArray: false,
    // })

    base.listenTo(`WebRTC/${this.props.gameId}`, {
      context: this,
      asArray: true,
      then(results){
        results.forEach((result, index) => {
          //console.log('result:',result)
          this.readMessage(result)
        });
      }
    })



    var yourVideo = document.getElementById("yourVideo");
    var friendsVideo = document.getElementById("friendsVideo");

    var RTCPeerConnection = window.webkitRTCPeerConnection;
    pc.onicecandidate = (event => event.candidate? this.sendMessage(yourId, JSON.stringify({'ice': event.candidate})):console.log("Sent All Ice") );
    pc.onaddstream = (event => friendsVideo.srcObject = event.stream);

    navigator.mediaDevices.getUserMedia({audio:true, video:true})
        .then(stream => yourVideo.srcObject = stream)
        .then(stream => pc.addStream(stream));
  }

  sendMessage(senderId, data) {
    //var msg = base.push({ sender: senderId, message: data });
    console.log('senderId, data:',senderId, data)
    var immediatelyAvailableReference = base.push(`WebRTC/${this.props.gameId}`, {
      data: {sender: senderId, message: data},
      then(err){
      }
    });
    // msg.remove();
  //   base.remove(`WebRTC/${this.props.gameId}`, function(err){
  //   if(!err){
  //     //Router.transitionTo('dashboard');
  //   }
  // });
  }

  readMessage(data) {
    // var msg = JSON.parse(data.val().message);
    // var sender = data.val().sender;
    var msg = JSON.parse(data.message);
    var sender = data.sender;
    // console.log('msg:', JSON.parse(data.message))
    // console.log('yourId:', yourId)
    // console.log('sender:',sender)
    if (sender !== yourId) {
        if (msg.ice !== undefined){
            //pc.addIceCandidate(new RTCIceCandidate(msg.ice));
            console.log('msg.ice:',msg.ice)
            console.log('RTCIceCandidate(msg.ice):',new RTCIceCandidate(msg.ice))
            }
        else if (msg.sdp.type === "offer"){
          console.log('msg.sdp.type:', msg.sdp.type)
            // pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
            //   .then(() => pc.createAnswer())
            //   //.then(answer => console.log('answer:',answer))
            //   .then(answer => pc.setLocalDescription(answer))
            //   .then(() => this.sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})));
            }
        else if (msg.sdp.type === "answer"){
          console.log('msg.sdp.type:', msg.sdp.type)

            pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
            }
    }
  };

  showFriendsFace() {
    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer) )
      .then(() => this.sendMessage(yourId, JSON.stringify({'sdp': pc.localDescription})) );
  }





  render(){
    console.log('yourId:',yourId)
    return(
      <div className="WebRTC">
        <button onClick={this.showFriendsFace()} type="button">Call</button>
        <div className="row">
          <div className="col s6 l12">
            <video id="yourVideo" autoPlay muted></video>
          </div>
          <div className="col s6 l12">
            <video id="friendsVideo" autoPlay></video>
            {/* <video className="remote responsive-video" height="300" id="remoteVideo" ref = "remote"></video> */}
          </div>
        </div>
      </div>
    )
  }



}

export default WebRTC;
