import React, { useRef, useEffect, Component } from 'react';
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Testimonial from '../components/sections/Testimonial';

const Home = ({loggedIn, loggedInCallBack}) => {
  useEffect(() => {
    async function fetchMyAPI() {
      fetch('/api/user/get', {
       method: 'GET',
       credentials: 'include',
       mode: "cors",
       headers: {
         'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
       }
      })
      .then(res => {
  if (res.status === 200) {
    console.log("home says logged in");
    loggedIn = true;
  }else {
    {
      console.log("home says logged out");
      loggedIn = false
    }
  }
     });
    }

    fetchMyAPI()
  }, [])
  
  console.log("home rendering with loggedin " + loggedIn);
  return (
    <>
      <Hero className="illustration-section-01" loggedIn={loggedIn} loggedInCallBack={loggedInCallBack}/>
      <FeaturesSplit invertMobile topDivider imageFill className="illustration-section-02" />
      <FeaturesTiles />
      <Testimonial topDivider />
    </>
  );
}

export default Home;
