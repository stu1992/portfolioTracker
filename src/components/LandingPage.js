import React from 'react';
import marketImg from '../market.png';
import loggedInMarketImg from '../private_market.png';
const LandingPage = ({state}) => {
  if( state['email']){
    return <img src={loggedInMarketImg} alt="Logo" />;
    }else{
   return <img src={marketImg} alt="Logo" />;
   }
};
export default LandingPage;
