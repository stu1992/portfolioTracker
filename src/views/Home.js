import React from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Testimonial from '../components/sections/Testimonial';

const Home = ({loggedIn, loggedInCallBack}) => {

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
