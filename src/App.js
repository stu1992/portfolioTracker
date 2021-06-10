// App.js

import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Button, Grid} from '@material-ui/core';
import About from './components/About';
import Strategy from './components/Strategy';
import Chart from './components/Chart'
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Profile from './components/Profile';

class App extends Component {

  constructor() {
  super();
  document.title = "Making My Mates rich";
  this.state = {
    loggedin: false,
    titles: {index: "Our Mission"}, // This is just variables for this page, simple words that change
    name: null,
    email: null,
    token: null
  };

}

  render() {
if(this.state.loggedin){
   this.state.titles['index'] = "My Portfolio";
}else{
   this.state.titles['index'] = "Our Mission";
}
    return (
    <Router>
        <div>
          <h2 style={{ padding: 10 }}>Making My Mates rich!</h2>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
            <li><Link to={'/'} className="nav-link"> {this.state.titles['index']} </Link></li>
            <li><Link to={'/strategy'} className="nav-link">Our Strategy</Link></li>
            <li><Link to={'/trends'} className="nav-link">Our Results</Link></li>
            <li><Login state={this.state} setFunction={this.setState.bind(this)} /></li>

          </ul>
          </nav>
          <hr />
          <Switch>
              <Route exact path='/' component={() => <Chart state={this.state}/>}/>
              <Route path='/trends' component={() => <LandingPage state={this.state}/>}/>
              <Route path='/strategy' component={() => <Strategy />}/>
              <Route path='/profile' component={() => <Profile state={this.state} setFunction={this.setState.bind(this)} />}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
