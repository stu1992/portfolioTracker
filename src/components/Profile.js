// Profile.js
import { useState , useEffect } from 'react'
import React, { Component } from 'react';
import axios from 'axios';
import Login from './Login'

const Profile = ({state, setFunction}) => {

const [name, setName] = useState("");

const basePortfolioURI = 'http://localhost:3000/api/user/get'
var portfolioURI = basePortfolioURI

const fetchUsers = async() => {
  const res = await fetch (portfolioURI, {
    method: 'GET',
    credentials: "same-origin"
    });
  const data = await res.json()
  console.log(data)
  return data
}

function fetchUser(){
  const getStocks = async () => {
    const JsonFromServer = await fetchUsers()
    //setName(JsonFromServer.name)
  setFunction({name: JsonFromServer.name,
  email: JsonFromServer.email,
token: JsonFromServer.token})
  }
  getStocks()
}
useEffect(() =>{fetchUser()}, [])

  return (
      <div>
        <h2>{state['name']}</h2>
        <h2>{state['email']}</h2>
        <h2>{state['token']}</h2>
      </div>
  )
}
export default Profile;
