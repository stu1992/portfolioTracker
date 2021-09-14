import React, { useRef, useEffect, Component } from 'react';
import { useLocation, Switch } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';
import ReactGA from 'react-ga';
import  API from './Api';

// Layouts
import LayoutDefault from './layouts/LayoutDefault';

// Views
import Home from './views/Home';
import Portfolio from './views/Portfolio';

// Initialize Google Analytics
ReactGA.initialize(process.env.REACT_APP_GA_CODE);

const trackPage = page => {
  ReactGA.set({ page });
  ReactGA.pageview(page);
};

const App = () => {

  // persisting app state
   const [name, setName] = React.useState(null);
   const [email, setEmail] = React.useState(null);
   const [loggedIn, setLoggedIn] = React.useState(null);

   const login = (value) => {
     setLoggedIn(value);
   }

  const childRef = useRef();
  let location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    document.body.classList.add('is-loaded')
    childRef.current.init();
    trackPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps


    API({
    url: '/user/get'//,
  //  attributes
  })
  .then(response => {
    setName(response.data['name']);
    setEmail(response.data['email']);
    setLoggedIn(true);
  });

  }, [location]);

  return (
    <ScrollReveal
      ref={childRef}
      children={() => (
        <Switch>
          <AppRoute exact path="/" component={() => <Home loggedInCallBack={login} />} layout={LayoutDefault} />
          <AppRoute exact path="/portfolio" component={() => <Portfolio name={name} loggedIn={loggedIn} />} layout={LayoutDefault} />
        </Switch>
      )} />
  );
}

export default App;
