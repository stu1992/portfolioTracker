import Image from 'react';
import marketImg from '../market.png';
import loggedInMarketImg from '../private_market.png';
import FittedImg from 'react-fitted-img';
import Button from './elements/Button';
import React, { useRef, useEffect, Component } from 'react';


const LandingPage = ({dailySecret}) => {


  const [secret, setSecret] = React.useState(dailySecret);

  const scope = ["0", "6", "3", "1"];
  var currentScope = 0;
  function changeScope(){
    var currentStr = scope[currentScope];
    console.log("the index is " + currentScope);
    var newStr = "";
    if(currentScope == 3){
      newStr = scope[0]
      currentScope = 0;
      console.log(currentStr);
      console.log(newStr);
    }else {
      currentScope ++;
      newStr = scope[currentScope]
      console.log(currentStr);
      console.log(newStr);
    }
    console.log(secret);
    var newDailySecret = secret.replace(currentStr, newStr);
    console.log(newDailySecret);
    dailySecret = newDailySecret;
    setSecret(dailySecret);
  }

    return (
      <div>
        <img style={{maxWidth:'100%', margin: "auto"}} onClick={changeScope} src={secret} alt="Market trends" />
     </div>
    )
}
export default LandingPage;
