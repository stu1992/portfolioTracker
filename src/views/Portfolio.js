import React from 'react';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Testimonial from '../components/sections/Testimonial';
import Chart from '../components/Chart';

const Portfolio = ({name, loggedIn}) => {
console.log(name);
console.log("signed in?" + loggedIn);
  return (
    <>
    <Chart name={name} loggedIn={loggedIn}/>
      <Testimonial topDivider />
    </>
  );
}

export default Portfolio;
