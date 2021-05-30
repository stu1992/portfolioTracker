// App.js

import React, { Component, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Chart from './components/Chart'
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Profile from './components/Profile';

class App extends Component {

  constructor() {
  super();
  this.state = {
    loggedin: false,
    name: null,
    email: null,
    token: null
  };

}

  render() {

    return (
    <Router>
        <div>
          <h2>Riiiich</h2>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
            <li><Link to={'/'} className="nav-link"> Login1 </Link></li>
            <li><Link to={'/contact'} className="nav-link">Trends</Link></li>
            <li><Link to={'/about'} className="nav-link">My Portfolio</Link></li>
            <li><Link to={'/Profile'} className="nav-link">Login2</Link></li>
          </ul>
          </nav>
          <hr />
          <Switch>
              <Route exact path='/' component={() => <Login state={this.state} setFunction={this.setState.bind(this)} />}/>
              <Route path='/contact' component={() => <LandingPage state={this.state}/>}/>
              <Route path='/about' component={() => <Chart state={this.state}/>}/>
              <Route path='/Profile' component={() => <Profile state={this.state} setFunction={this.setState.bind(this)} />}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
