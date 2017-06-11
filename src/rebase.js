var Rebase = require('re-base');
var firebase = require('firebase');
var app = firebase.initializeApp({
  apiKey: "AIzaSyCouDMJ9KLy9lR9yUygC1gl1cA7KqKQVqY",
  authDomain: "tictactoe-713bc.firebaseapp.com",
  databaseURL: "https://tictactoe-713bc.firebaseio.com",
  projectId: "tictactoe-713bc",
  storageBucket: "tictactoe-713bc.appspot.com",
  messagingSenderId: "675274661331"
});
var base = Rebase.createClass(app.database());
export default base;
