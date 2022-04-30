import React from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Testimonial from '../components/sections/Testimonial';
import Chart from '../components/Chart';
import Header from '../components/layout/HeaderLoggedIn';

const Portfolio = ({name, loggedIn, dailySecret}) => {
console.log(name);
console.log("signed in?" + loggedIn);
  return (
    <>
    <Header navPosition="right" className="reveal-from-bottom" />
    <main className="site-content">

    <Chart name={name} loggedIn={loggedIn} dailySecret={dailySecret}/>
	  </main>
    </>
  );
}

export default Portfolio;
