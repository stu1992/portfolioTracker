import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Routes ,Route, BrowserRouter } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import  API from './Api';
import './assets/scss/style.scss';
// Layouts
import LayoutDefault from './layouts/LayoutDefault';
import LayoutLoggedIn from './layouts/LayoutLoggedIn';

// Views
import Chart from './components/Chart';
import Home from './views/Home';
import Signup from './views/Signup';

import logo from './logo.svg';
import './App.css';

const App = () => {
  const navigate = useNavigate(); //breaking
  // persisting app state
  const [name, setName] = React.useState(null);
  const [dailySecret, setDailySecret] = React.useState("secret_undef");
  const [histSecret, setHistSecret] = React.useState("hist_undef");
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const login = (value) => {
    setUserLoggedIn(value);
    if (value){
      API({
    url: '/user/get'
  })
  .then(response => {
    if (response.statusText === "OK"){
      setName(response.data['name']);
      setDailySecret(response.data['dailySecret']);
      setHistSecret(response.data['histSecret']);
      navigate("/portfolio");
    }
  });
  };
  }
  const childRef = useRef(); // what's this for

  useEffect(() => {
    API({
    url: '/user/get'
  })
  .then(response => {
    if (response.statusText === "OK"){
      setName(response.data['name']);
      setDailySecret(response.data['dailySecret']);
      setHistSecret(response.data['histSecret']);
      setUserLoggedIn(true);
      //navigate("/portfolio");
    }
  }).catch(response =>{
    if(window.location.pathname === "/portfolio"){
      navigate("/");
    }
    setUserLoggedIn(false);
  });
  });


if(userLoggedIn){
  return (
        <Routes>
	      <Route exact path="/" element={<Home setUserLoggedIn={setUserLoggedIn} loggedIn={true} loggedInCallBack={login} />}/>
	      <Route exact path="/portfolio" element={<Chart name={name} dailySecret={dailySecret} histSecret={histSecret}/>} />
        </Routes>
  )
}else{
  return (
        <Routes>

	      <Route exact path="/" element={<Home loggedInCallBack={login} loggedOutCallBack={login} userLoggedIn={userLoggedIn} />}/>
	      <Route exact path="/signup" element={<Signup />} /> 
        </Routes>
	)
}
}

export default App;
