import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class VideoChat extends Component {
  constructor (props){
    super(props);
    this.addVideo = this.addVideo.bind(this);
    this.removeVideo = this.removeVideo.bind(this);
    this.readyToCall = this.readyToCall.bind(this);
  }
  componentDidMount(){
    this.webrtc = new window.SimpleWebRTC({
      localVideoEl: ReactDOM.findDOMNode(this.refs.local),
      remoteVideosEl: "",
      autoRequestMedia: true
      //url: 'https://your-production-signalserver.com/'
    });
    console.log("webrtc component mounted");
    this.webrtc.on('videoAdded', this.addVideo);
    this.webrtc.on('videoRemoved', this.removeVideo);
    this.webrtc.on('readyToCall', this.readyToCall);
  }

  addVideo(video, peer) {
     console.log('video added', peer);
     //  console.log(this.refs.remotes);
     var remotes = ReactDOM.findDOMNode(this.refs.remotes);
     console.log(remotes);
     if (remotes) {
       var container = document.createElement('div');
       container.className = 'videoContainer';
       container.id = 'container_' + this.webrtc.getDomId(peer);
       container.appendChild(video);
       // suppress contextmenu
       video.oncontextmenu = function() {
         return false;
       };
       console.log(container);
       remotes.appendChild(container);
     }
  }

  removeVideo(video, peer) {
    console.log('video removed ', peer);
    var remotes = ReactDOM.findDOMNode(this.refs.remotes);
    var el = document.getElementById(peer ? 'container_' +       this.webrtc.getDomId(peer) : 'localScreenContainer');
    if (remotes && el) {
      remotes.removeChild(el);
    }
  }

  readyToCall() {
    return this.webrtc.joinRoom(this.props.gameId);
  }

  connect() {
    console.log("connected");
  }

  disconnect() {
    console.log("disconnected");
  }

  render(){
    return(
      <div className="VideoChat">
        <video className="local" height="300" id="localVideo" ref = "local"></video>
        <div className="remotes" id="remotesVideos" ref = "remotes"></div>
      </div>
    )
  }



}

export default VideoChat;
