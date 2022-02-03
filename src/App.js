import React, { useRef, useEffect, useState } from 'react';
import { useLocation, Switch, useHistory } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import ReactGA from 'react-ga';
import  API from './Api';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';
import LayoutLoggedIn from './layouts/LayoutLoggedIn';

// Views
import Portfolio from './views/Portfolio';
import Chart from './components/Chart';
import Home from './views/Home';

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {
const history = useHistory();
  // persisting app state
   const [name, setName] = React.useState(null);
   const [loggedIn, setLoggedIn] = React.useState(null);
   const [dailySecret, setDailySecret] = React.useState("secret_undef");
   const [userLoggedIn, setUserLoggedIn] = useState(false);

   const login = (value) => {
     setLoggedIn(value);
     if (value){
         history.push("/portfolio");
     }
   }

  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    API({
    url: '/user/get'//,
  //  attributes
  })
  .then(response => {
    if (response.statusText == "OK"){
        setName(response.data['name']);
        setDailySecret(response.data['dailySecret']);
        setUserLoggedIn(true);
	console.log("auto login success\n "+ name );
    }
  }).catch(response =>{
    console.log("auto login failed");
    setUserLoggedIn(false);
  }
  );

  }, [location]);
if(userLoggedIn){
  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Switch>
          <AppRoute exact path="/" component={() => <Home setUserLoggedIn={setUserLoggedIn} userLoggedIn={userLoggedIn} loggedInCallBack={login} loggedOutCallBack={login} />} layout={LayoutLoggedIn} />
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
        </Switch>
      )} />
  );
}
}

export default App;
