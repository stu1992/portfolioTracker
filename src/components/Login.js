// Login.jsx
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import  API from './Api';
import  Chart from './Chart';
import Profile from './Profile';
const Jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';
export default class Login extends Component {
  constructor(props) {
    super(props)
  }
  forceUpdateHandler(){
    API({
    url: '/user/get'//,
  //  attributes
  })
  .then(response => {
    this.props.setFunction({name: response.data['name'], email: response.data['email'], tags: response.data['tags']});
  });
    this.forceUpdate();
  };

    handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  };
  logout(){
    console.log("logging out");
    API({
    url: '/user/logout'//,
  //  attributes
  })
  .then(response => {
    this.props.setFunction({name: null, email: null, loggedin: false});
  });
  };
  onSubmit = (event) => {
  event.preventDefault();
  fetch('/api/user/login', {
    method: 'POST',
    body: JSON.stringify(this.state),
    credentials: 'include',
    mode: "cors",
    headers: {
      'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*'
    }
  })
  .then(res => {
    if (res.status === 200) {
      console.log("client loging success!");
      this.props.state['loggedin'] = true;
        this.forceUpdateHandler();
    } else {
      const error = new Error(res.error);
      throw error;
    }
  });
}
render() {
  if( this.props.state.loggedin !== undefined){
    return(
      <div>
        <form onSubmit={this.logout}>
      <h1>Hello {this.props.state['name']}</h1>
        <div>
        </div>
      <input type="submit" value="Log out"/>
      <Link to={'/Profile'} className="nav-link">My Profile</Link>
      </form>
    </div>
    )
 }else{
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Login Below!</h1>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={this.state.email}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={this.state.password}
          onChange={this.handleInputChange}
          required
        />
       <input type="submit" value="Submit"/>
      </form>
    )
  }
}
}
