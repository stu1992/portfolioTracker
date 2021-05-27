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

const derp = () =>
{
console.log("deeeeeeeeeeeeeeeeeeeeeeerp");
}
class App extends Component {

  constructor() {
  super();
  console.log("top level")
  this.state = {
    name: 'Stu'
  };

}

  render() {

    return (
    <Router>
        <div>
          <h2>Welcome to React Router Tutorial</h2>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav mr-auto">
            <li><Link to={'/'} className="nav-link"> Home </Link></li>
            <li><Link to={'/contact'} className="nav-link">{this.state.name}</Link></li>
            <li><Link to={'/about'} className="nav-link">About</Link></li>
            <li><Link to={'/Profile'} className="nav-link">Profile</Link></li>
          </ul>
          </nav>
          <hr />
          <Switch>
              <Route exact path='/' component={Login} />
              <Route path='/contact' component={LandingPage} />
              <Route path='/about' component={Chart} />
              <Route path='/Profile' component={() => <Profile state={this.state.name} setFunction={this.setState.bind(this)} />}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
