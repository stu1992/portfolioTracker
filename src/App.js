import React, { useRef, useEffect, useState } from 'react';
import { Switch, useHistory } from 'react-router-dom';
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

const App = () => {
const history = useHistory();
  // persisting app state
   const [name, setName] = React.useState(null);
   const [dailySecret, setDailySecret] = React.useState("secret_undef");
   const [userLoggedIn, setUserLoggedIn] = useState(false);

   const login = (value) => {
     setUserLoggedIn(value);
     if (value){
         history.push("/portfolio");
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
        setUserLoggedIn(true);
	console.log("auto login success\n "+ name );
    }
  }).catch(response =>{
    console.log("auto login failed at " + window.location.pathname);
    if(window.location.pathname === "/portfolio"){
        history.push("/");
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
        <Switch>
          <AppRoute exact path="/" component={() => <Home setUserLoggedIn={setUserLoggedIn} loggedIn={true} loggedInCallBack={login} />} layout={LayoutLoggedIn} />
          <AppRoute exact path="/portfolio" component={() => <Chart name={name} dailySecret={dailySecret} />} layout={LayoutLoggedIn} />
        </Switch>
      )} />
  );
}else{
  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Switch>
          <AppRoute exact path="/" component={() => <Home loggedInCallBack={login} loggedOutCallBack={login} />} layout={LayoutDefault} />
          <AppRoute exact path="/Signup" component={() => <Signup loggedInCallBack={login} loggedOutCallBack={login} />} layout={LayoutDefault} />
	</Switch>
      )} />
  );
}
}

export default App;
