import Image from 'react';
import marketImg from '../market.png';
import loggedInMarketImg from '../private_market.png';
import FittedImg from 'react-fitted-img';

const LandingPage = ({dailySecret}) => {
    return (
      <div>
        <img style={{maxWidth:'100%', margin: "auto"}} src={dailySecret} alt="Market trends" />
     </div>
    )
}
export default LandingPage;
