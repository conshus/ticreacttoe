import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={Home}/>
            <Route path="/game/:gameId"  render={(defaultProps) =>  <Game {...defaultProps}/>} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
