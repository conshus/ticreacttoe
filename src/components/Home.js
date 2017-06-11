import React, { Component } from 'react';
import logo from '../logo.svg';
import base from '../rebase';
import { Redirect } from 'react-router-dom';

class Home extends Component {
  constructor (props){
    super(props);
    this.state = {
      gameId: ''
    }
  }
  startAGame(){
    console.log('start A Game');
    //var immediatelyAvailableReference = base.push('game', {
    base.push('game', {
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
        oPlayer : '',
        xPlayer : '',
        url: '',
        winner: false,
        refreshGame: false,
        currentMove: 'X',
        winningPositions: {'0':'','1':'','2':''}
      }
    }).then(newLocation => {
      var generatedKey = newLocation.key;
      console.log(generatedKey);
      this.setState({gameId: generatedKey})
    }).catch(err => {
      //handle error
    });
    //available immediately, you don't have to wait for the Promise to resolve
    //var generatedKey = immediatelyAvailableReference.key;

  }
  render(){
    if (this.state.gameId) {
          return (
            <Redirect to={'/game/'+this.state.gameId}/>
          )
        }

    return (
      <div className="Home wholeScreen flex hcenter vcenter">
        <div>
          <h1>Tic <img src={logo} className="App-logo" alt="spinning React Logo" /> Toe</h1>
          <button className="waves-effect waves-light btn" onClick={this.startAGame.bind(this)}>Start a Game</button>
        </div>
      </div>
    )
  }
}

export default Home;
