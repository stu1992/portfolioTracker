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
import OrderForm from './views/OrderForm';
import New from './views/New';

import logo from './logo.svg';
import './App.css';

const App = () => {
  const navigate = useNavigate(); //breaking
  // persisting app state
  const [name, setName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [dailySecret, setDailySecret] = React.useState("secret_undef");
  const [histSecret, setHistSecret] = React.useState("hist_undef");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userOnboarded, setUserOnboarded] = useState(false);

const onboard = () =>{
  setUserOnboarded(true);
}
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
      setEmail(response.data['email']);
      if(response.data['onboarded'] === "false")
      {
        navigate("/new");
      }
      else{
	setUserOnboarded(true);
        navigate("/portfolio");
      }
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
      setEmail(response.data['email']);
      if(response.data['onboarded'] === "true"){
        setUserOnboarded(true);
      }
      //navigate("/portfolio");
    }
  }).catch(response =>{
    if(window.location.pathname === "/portfolio"){
      navigate("/");
    }
    setUserLoggedIn(false);
  });
  });


if(userLoggedIn && userOnboarded){
  return (
        <Routes>
	      <Route exact path="/" element={<Home setUserLoggedIn={setUserLoggedIn} loggedIn={true} onboarded={true} loggedInCallBack={login} />}/>
	      <Route exact path="/portfolio" element={<Chart name={name} dailySecret={dailySecret} histSecret={histSecret}/>} />
	      <Route exact path="/order" element={<OrderForm email={email} />} />
        </Routes>
  )
}else if(userLoggedIn && !userOnboarded){
  return (
        <Routes>
              <Route exact path="/" element={<Home setUserLoggedIn={setUserLoggedIn} loggedIn={true} onboarded={false} loggedInCallBack={login} />}/>
              <Route exact path="/portfolio" element={<Chart name={name} dailySecret={dailySecret} histSecret={histSecret}/>} />
              <Route exact path="/order" element={<OrderForm email={email} />} />
          <Route exact path="/new" element={<New onboarded={onboard} />} />
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
