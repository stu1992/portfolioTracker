import React, { useRef, useEffect, useState } from 'react';
import { Routes ,Route, useNavigate } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import  API from './Api';
// Layouts
import LayoutDefault from './layouts/LayoutDefault';
import LayoutLoggedIn from './layouts/LayoutLoggedIn';

// Views
import Chart from './components/Chart';
import Home from './views/Home';
import Signup from './views/Signup';

console.log("derp");
const App = () => {
const navigate = useNavigate();
  // persisting app state
   const [name, setName] = React.useState(null);
   const [dailySecret, setDailySecret] = React.useState("secret_undef");
   const [histSecret, setHistSecret] = React.useState("hist_undef");
   const [userLoggedIn, setUserLoggedIn] = useState(false);

   const login = (value) => {
     setUserLoggedIn(value);
     if (value){
         navigate("/portfolio");
     }
   }

  const childRef = useRef();

  useEffect(() => {
    API({
    url: '/user/get'//,
  //  attributes
  })
  .then(response => {
    if (response.statusText === "OK"){
        setName(response.data['name']);
        setDailySecret(response.data['dailySecret']);
	setHistSecret(response.data['histSecret']);
        setUserLoggedIn(true);
    }
  }).catch(response =>{
    if(window.location.pathname === "/portfolio"){
        navigate("/");
    }
    setUserLoggedIn(false);
  }
  );

  });
if(userLoggedIn){
  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Routes>
          <Route exact path="/" component={() => <Home setUserLoggedIn={setUserLoggedIn} loggedIn={true} loggedInCallBack={login} />} layout={LayoutLoggedIn} />
          <Route exact path="/portfolio" component={() => <Chart name={name} dailySecret={dailySecret} histSecret={histSecret}/>} layout={LayoutLoggedIn} />
        </Routes>
      )} />
  );
}else{
  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Routes>
          <Route exact path="/" component={() => <Home loggedInCallBack={login} loggedOutCallBack={login} />} layout={LayoutDefault} />
          <Route exact path="/Signup" component={() => <Signup loggedInCallBack={login} loggedOutCallBack={login} />} layout={LayoutDefault} />
	</Routes>
      )} />
  );
}
}

export default App;
