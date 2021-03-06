import React, { Component } from 'react';
import base from '../rebase';
import axios from 'axios';
import { Link } from 'react-router-dom';
//import VideoChat from './VideoChat';
import WebRTC from './WebRTC';
// import ReactDOM from 'react-dom';



let possible = [
  ['0','1','2'],
  ['3','4','5'],
  ['6','7','8'],
  ['0','3','6'],
  ['1','4','7'],
  ['2','5','8'],
  ['0','4','8'],
  ['2','4','6']
]

let myMoves = []
class Game extends Component {
  constructor (props){
    super(props);
    this.state = {
      game:{},
      playerMark:'',
      step: 0,
      displayError: false,
      opponent: '',
    }

    // this.addVideo = this.addVideo.bind(this);
    // this.removeVideo = this.removeVideo.bind(this);
    // this.readyToCall = this.readyToCall.bind(this);



  }
  componentDidMount(){
    console.log(this.props.match.params.gameId)
    base.syncState(`game/${this.props.match.params.gameId}`, {
      context: this,
      state: 'game',
      asArray: false,
      then(results){
        axios.get(`https://api-ssl.bitly.com/v3/shorten?access_token=f98a5451d060cb4b77ed81efcd3d430992f25a7e&longUrl=https%3A%2F%2Ftictactoe-713bc.firebaseapp.com%2Fgame%2F${this.props.match.params.gameId}`)
        .then(response => {
          base.update(`game/${this.props.match.params.gameId}`,{
            data: {url:response.data.data.url}
          })
        })
        .catch(function (error) {
          console.log(error)
        });
      }
    })


    // this.webrtc = new window.SimpleWebRTC({
    //   localVideoEl: ReactDOM.findDOMNode(this.refs.local),
    //   remoteVideosEl: "",
    //   autoRequestMedia: true
    //   //url: 'https://your-production-signalserver.com/'
    // });
    // console.log("webrtc component mounted");
    // this.webrtc.on('videoAdded', this.addVideo);
    // this.webrtc.on('videoRemoved', this.removeVideo);
    // this.webrtc.on('readyToCall', this.readyToCall);




  }


// video chat start

// addVideo(video, peer) {
//    console.log('video added', peer);
//    //  console.log(this.refs.remotes);
//    var remotes = ReactDOM.findDOMNode(this.refs.remotes);
//    console.log(remotes);
//    if (remotes) {
//      var container = document.createElement('div');
//      container.className = 'videoContainer';
//      container.id = 'container_' + this.webrtc.getDomId(peer);
//      container.appendChild(video);
//      // suppress contextmenu
//      video.classBane = "responsive-video";
//      video.oncontextmenu = function() {
//        return false;
//      };
//      console.log(container);
//      remotes.appendChild(container);
//    }
// }
//
// removeVideo(video, peer) {
//   console.log('video removed ', peer);
//   var remotes = ReactDOM.findDOMNode(this.refs.remotes);
//   var el = document.getElementById(peer ? 'container_' +       this.webrtc.getDomId(peer) : 'localScreenContainer');
//   if (remotes && el) {
//     remotes.removeChild(el);
//   }
// }
//
// readyToCall() {
//   return this.webrtc.joinRoom(this.props.gameId);
// }
//
// connect() {
//   console.log("connected");
// }
//
// disconnect() {
//   console.log("disconnected");
// }
//



// video chat end


  didIWin(playerMark, myMoves){
    console.log('didIWin:',playerMark, myMoves, possible)
    for (let i=0; i<possible.length; i++){
      if ((myMoves.indexOf(possible[i][0]) !== -1) && (myMoves.indexOf(possible[i][1]) !== -1) && (myMoves.indexOf(possible[i][2]) !== -1)){
        console.log(playerMark,"you win!");
        base.update(`game/${this.props.match.params.gameId}`,{
          data: {winner:true}
        })
        base.update(`game/${this.props.match.params.gameId}/winningPositions`,{
          data: {'0':possible[i][0], '1':possible[i][1], '2':possible[i][2]}
        })
      }
    }
  }

  recordMove(move){
    console.log(this, move)
    if (this.state.playerMark === this.state.game.currentMove && this.state.game.winner === false){
      if (this.state.game[move] === ''){
        let currentMove;
        if (this.state.playerMark === 'X') {
          currentMove = 'O'
        } else {
          currentMove = 'X'
        }
        base.update(`game/${this.props.match.params.gameId}`,{
          data: {
            [move]:this.state.playerMark,
            currentMove: currentMove
          }
        }).then(() => {
          myMoves.push(move);
          myMoves.sort();
          this.didIWin(this.state.playerMark,myMoves);
        console.log('move added');
        }).catch(err => {
          //handle error
        });
      } else {
        console.log('space is filled')
      }
    } else {
      console.log('not your turn')
    }
  }

  selectXO(selected){
    console.log(this,this.playerName.value,selected)
    if (this.playerName.value !== ''){
      base.update(`game/${this.props.match.params.gameId}`,{
        data: {[selected]:this.playerName.value}
      }).then(() => {
        let playerMark;
        console.log('player selected');
        if (selected === 'xPlayer'){
          playerMark = 'X'
        } else {
          playerMark = 'O'
        }
        this.setState({
          playerMark: playerMark,
          step: 1
        })
      }).catch(err => {
        //handle error
      });
    } else {
      this.setState({
        displayError:true
      })
    }
  }

  displayError(error){
    console.log(error);
    let errorText;
    switch(error){
      case 1:
      console.log('error 1');
      errorText = <span>Sorry, name not found. <br/> <Link to={`/`}>Start a New Game?</Link></span>
      break;
      default:
      console.log('default error');
      errorText = 'Please Enter a Name';
    }
    return(
      <div className="red-text">
        <h6>Error</h6>
        {/* {this.playerName.value==='' ? 'Please Enter a Name' : null} */}
        {errorText}
        <div onClick={()=>{this.setState({displayError:false})}}>X close</div>
      </div>
    )
  }
  setPlayers(){
    return(
      <div className="setPlayers flex wholeScreen vcenter hcenter">
        <div>
          <form>
            <div className="input-field">
              <input id="playerName" placeholder="Please enter your Name" type="text" className="validate flow-text" ref={(input) => { this.playerName = input; }} required />
            </div>
          </form>
          <div className="flow-text">Select</div>
          <button className="flow-text" onClick={this.selectXO.bind(this,'xPlayer')}>X</button>
          <span className="flow-text"> or </span>
          <button className="flow-text" onClick={this.selectXO.bind(this,'oPlayer')}>O</button>
          <br/><br/>
          <div className="flow-text">Send this link to a friend to start game:</div>
          <input id="gameIdLink" value={this.state.game.url} readOnly/>
          <a className="gameIdBitly btn" data-clipboard-target="#gameIdLink"><i className="material-icons left"><i className="material-icons">content_copy</i></i>copy to clipboard</a>
          {this.state.displayError && this.displayError()}
        </div>
      </div>
    )
  }

  joinGame(){
    let gameCreator;
    let player2Mark
    if (this.state.game.oPlayer !== ''){
      gameCreator = this.state.game.oPlayer;
      player2Mark = 'xPlayer'
    } else {
      gameCreator = this.state.game.xPlayer;
      player2Mark = 'oPlayer'
    }
    return(
      <div className="joinGame flex wholeScreen vcenter hcenter">
        <div>
          <h6 className="flow-text">{gameCreator} would like to play a Game</h6>
          <form>
            <div className="input-field">
              <input id="playerName" placeholder="Please enter your Name" type="text" className="validate" ref={(input) => { this.playerName = input; }} required />
            </div>
          </form>
          <button className="btn" onClick={this.selectXO.bind(this,player2Mark)}>Join</button>
          {this.state.displayError && this.displayError()}
        </div>
      </div>
    )
  }

  checkIfPlayer(){
    console.log(this.playerName.value)
    if (this.playerName.value === this.state.game.xPlayer){
      console.log('matches x player')
      this.setState({playerMark: 'X', step: 1})
      this.displayBoard();
    } else if (this.playerName.value === this.state.game.oPlayer){
      console.log('matches o player')
      this.setState({playerMark: 'O', step: 1})
      this.displayBoard();
    } else {
      console.log('does not match either players')
      this.setState({
        displayError:true
      })
    }

  }

  rejoinGame(){
    console.log('rejoin game');
    return(
      <div className="rejoinGame flex wholeScreen vcenter hcenter">
        <div>
          <h4 className="flow-text">Rejoining the game?</h4>
          <form>
            <div className="input-field">
              <input id="playerName" placeholder="Please enter your Name" type="text" className="validate" ref={(input) => { this.playerName = input; }} required />
            </div>
          </form>
          <button className="btn" onClick={this.checkIfPlayer.bind(this)}>Rejoin</button>
          {this.state.displayError && this.displayError(1)}
        </div>
      </div>
    )
  }

  displayBoard(){

    return(
      <div className="NewGame wholeScreen">
        <div className="row">
          <div className="col s12 l3">


            {/* <div className="VideoChat">
              <div className="row">
                <div className="col s6 l12">
                  <video className="local responsive-video" height="300" id="localVideo" ref = "local"></video>
                </div>
                <div className="col s6 l12">
                  <div className="remotes" id="remotesVideos" ref = "remotes"></div>
                </div>
              </div>
            </div> */}


            {/* <VideoChat gameId={this.props.match.params.gameId}/> */}
            <WebRTC gameId={this.props.match.params.gameId} makeTheCall='true' />
            <h6>X: {this.state.game.xPlayer} | O: {this.state.game.oPlayer}</h6>
            <br/>{this.state.game.currentMove}'s Turn
            <br/><button className="btn" onClick={()=>{
              base.update(`game/${this.props.match.params.gameId}/`,{
                data: {refreshGame:true}
              })
            }}>New Game</button>
          </div>
          <div className="col s12 l9">
            <div className="Board">
              <div className="flex flexcolumn vcenter" id="grid">
                <div className="flex" id="row0">
                  <div className="space flex hcenter vcenter" id="0" onClick={this.recordMove.bind(this,'0')}>{this.state.game[0]}</div>
                  <div className="space flex hcenter vcenter" id="1" onClick={this.recordMove.bind(this,'1')}>{this.state.game[1]}</div>
                  <div className="space flex hcenter vcenter" id="2" onClick={this.recordMove.bind(this,'2')}>{this.state.game[2]}</div>
                </div>
                <div className="flex" id="row1">
                  <div className="space flex hcenter vcenter" id="3" onClick={this.recordMove.bind(this,'3')}>{this.state.game[3]}</div>
                  <div className="space flex hcenter vcenter" id="4" onClick={this.recordMove.bind(this,'4')}>{this.state.game[4]}</div>
                  <div className="space flex hcenter vcenter" id="5" onClick={this.recordMove.bind(this,'5')}>{this.state.game[5]}</div>
                </div>
                <div className="flex" id="row2">
                  <div className="space flex hcenter vcenter" id="6" onClick={this.recordMove.bind(this,'6')}>{this.state.game[6]}</div>
                  <div className="space flex hcenter vcenter" id="7" onClick={this.recordMove.bind(this,'7')}>{this.state.game[7]}</div>
                  <div className="space flex hcenter vcenter" id="8" onClick={this.recordMove.bind(this,'8')}>{this.state.game[8]}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  displayWinner(){
    document.getElementById(this.state.game.winningPositions[0]).style.color ="red";
    document.getElementById(this.state.game.winningPositions[1]).style.color ="red";
    document.getElementById(this.state.game.winningPositions[2]).style.color ="red";
  }

  newGame(){
    myMoves=[];
    console.log('myMoves:',myMoves)
    console.log(document.querySelectorAll('.space'))
    //document.querySelectorAll('.space').style.color ="black";
    document.getElementById('0').style.color ="black";
    document.getElementById('1').style.color ="black";
    document.getElementById('2').style.color ="black";
    document.getElementById('3').style.color ="black";
    document.getElementById('4').style.color ="black";
    document.getElementById('5').style.color ="black";
    document.getElementById('6').style.color ="black";
    document.getElementById('7').style.color ="black";
    document.getElementById('8').style.color ="black";
    base.update(`game/${this.props.match.params.gameId}/`,{
      data: {
        '0' : '',
        '1' : '',
        '2' : '',
        '3' : '',
        '4' : '',
        '5' : '',
        '6' : '',
        '7' : '',
        '8' : '',
        winner: false,
        refreshGame: false,
        winningPositions: {'0':'','1':'','2':''}
      }
    })
  }

  render(){
    console.log(this.props)
    console.log(this.state)
    console.log('my moves:', myMoves)
    console.log(this.state.game.winner)
    return (
      <div className="Game">
        {(this.state.game.oPlayer!=='' && this.state.game.xPlayer !=='') && this.displayBoard()}
        {((this.state.step===0 || this.state.step===1) && (this.state.game.oPlayer==='' || this.state.game.xPlayer ==='')) && this.setPlayers()}
        {(this.state.step===0 && (this.state.game.oPlayer!=='' || this.state.game.xPlayer !=='')) && this.joinGame()}
        {(this.state.game.winner && this.state.game.winningPositions[0] !== '') && this.displayWinner()}
        {this.state.game.refreshGame && this.newGame()}
        {(this.state.step===0 && (this.state.game.oPlayer!=='' && this.state.game.xPlayer !=='')) && this.rejoinGame()}
      </div>
    )
  }
}

export default Game;
