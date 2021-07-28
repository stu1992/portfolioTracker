// Profile.js
import { useState , useEffect } from 'react'
import React, { Component } from 'react';
import  API from './Api';
import axios from 'axios';
import Login from './Login'

export default class Profile extends Component {
  constructor(props) {
    super(props)
  }
render() {
  let tagsList = "";
  if(this.props.state['tags']!= null){
  tagsList = this.props.state['tags'].toString();
  }
  return (
    <div style={{ padding: 20 }}>
        <h2>{this.props.state['name']}</h2>
        <h2>{this.props.state['email']}</h2>
        <h2>{tagsList}</h2>
        </div>
  )
}
}
