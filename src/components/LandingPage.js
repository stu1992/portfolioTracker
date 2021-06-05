import React from 'react';
import marketImg from '../market.png';
import loggedInMarketImg from '../private_market.png';
const LandingPage = ({state}) => {
  if( state['email']){

    return <img style={{width:'100%'}} src={loggedInMarketImg} alt="Logo" />;

    }else{
   return <img style={{width:'100%'}} src={marketImg} alt="Logo" />;
   }
};
export default LandingPage;
