import React from 'react';
import marketImg from '../market.png';
import loggedInMarketImg from '../private_market.png';
import FittedImg from 'react-fitted-img';
const LandingPage = ({loggedIn}) => {
  if( !loggedIn){

    return (
      <div>
        <img style={{maxWidth:'100%'}} src={loggedInMarketImg} alt="Market trends" />
     </div>
    )
    }else{
   return(
     <div>
    <img style={{maxWidth:'100%'}} src={marketImg} alt="Market trends" />
</div>
  )
   }
}
export default LandingPage;
