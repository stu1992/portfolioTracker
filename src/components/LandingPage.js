import React, { useRef, useEffect, Component } from 'react'
const LandingPage = ({dailySecret, histSecret}) => {

  const [secret, setSecret] = React.useState(dailySecret);
  const [currentScope, setCurrentScope] = React.useState(2);

  const scope = ["0", "12", "6", "3"];
  function changeScope(){
    var currentStr = scope[currentScope];
    var newStr = "";
    if(currentScope == 3){
      newStr = scope[0]
      setCurrentScope(0);
    }else {
      var newScope = currentScope + 1;

      newStr = scope[newScope]
      setCurrentScope(newScope)
    }

    var newDailySecret = secret.replace(currentStr, newStr);
    dailySecret = newDailySecret;
    setSecret(dailySecret);
  }

    return (
      <div>
        <img style={{maxWidth:'100%', margin: "auto"}} onClick={changeScope} src={secret} alt="Market trends" />
	    <div style={{margin: "20px"}} />
	<img style={{maxWidth:'100%', margin: "auto"}} src={histSecret} alt="Compare yourself" />
     </div>
    )
}
export default LandingPage;
