// Login.jsx
import React, { Component } from 'react';
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
      this.props.history.push('/');
    } else {
      const error = new Error(res.error);
      throw error;
    }
  })
  .catch(err => {
    console.error(err);
    alert('Error logging in please try again');
  });
}
render() {
  //if( this.state['email']){
  //  return(
  //    <h1>logged in!</h1>
  //  );
//  }else{
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
    );
//  }
  }
}
//dev-htek42ux
