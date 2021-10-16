import Image from 'react';
import marketImg from '../market.png';
import loggedInMarketImg from '../private_market.png';
import FittedImg from 'react-fitted-img';

const LandingPage = ({loggedIn, dailySecret}) => {
  if( loggedIn){
    console.log("secret passed in as:" +dailySecret);
 var link = dailySecret;
    return (
      <div>
        <img style={{maxWidth:'100%', margin: "auto"}} src={link} alt="Market trends" />

     </div>
    )
    }else{
   return(
     <div>
    <img style={{maxWidth:'100%', margin: "auto"}} src={marketImg} alt="Market trends" />
</div>
  )
   }
}
export default LandingPage;
