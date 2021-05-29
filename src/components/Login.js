// Login.jsx
import React, { Component } from 'react';
import  API from './Api';
import  Chart from './Chart';
const Jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';
export default class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email : '',
      password: ''
    };
  }  handleInputChange = (event) => {
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
   this.props.state['name'] = null;
   this.props.state['email'] = null;
  });
  };
  onSubmit = (event) => {
  event.preventDefault();
  console.log("pressing");
  fetch('http://localhost:3000/api/user/login', {
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
    } else {
      const error = new Error(res.error);
      throw error;
    }
  });
}
render() {
  console.log("deeeeeerp" +this.props.state['email']);
  if( this.props.state['email']){
    return(
      <div>
        <form onSubmit={this.logout}>
      <h1>logged in{this.props.state['name']}!</h1>
        <div>
          <h2>{this.props.state['name']}</h2>
          <h2>{this.props.state['email']}</h2>
          <h2>{this.props.state['token']}</h2>
        </div>
      <input type="submit" value="Log out"/>
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
//  }
  }
}
}
