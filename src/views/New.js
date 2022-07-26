import * as React from 'react';
import { useNavigate } from 'react-router';
import  API from '../Api';
import Header from '../components/layout/HeaderOnboarding';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const New = ({onboarded}) => {
  const [ticker, setTicker] = React.useState('AAPL');
  const [tickersState, setTickersState] = React.useState('');
  const [orderType, setOrderType] = React.useState('buy');
  const [number, setNumber] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [priceError, setPriceError] = React.useState(false);
  const [disableAddButton, setDisableAddButton] = React.useState(true);
  const [disableSubmitButton, setDisableSubmitButton] = React.useState(true);
  const [isLoading, setLoading] = React.useState(true);
  const [assets, setAssets] = React.useState({});
  const [assetsText, setAssetsText] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(event.target.value);
  };

const navigate = useNavigate();
React.useEffect(() => {
  if(isLoading === false)
	return;
    API({
    url: '/ticker'
  })
  .then(response => {
    if (response.statusText === "OK"){
    var options = "";
    
    for(const ticker of response.data){
	if(ticker === "VIX")
	    continue;
        options += '{"value": "' + ticker+ '" ,"label" : "' + ticker + '"},';
    }
    options = "[" + options.slice(0, -1)+ "]";
    console.log("received tickers");
    setTickersState(JSON.parse(options));
    setLoading(false);
    }
  }).catch(response =>{
  });
  });


  const handleOrderType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderType(event.target.value);
  };
  const handleNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
	  console.log(event.target.value);
    if ( parseFloat(event.target.value) <=0 || isNaN(parseFloat(event.target.value))){
    console.log("number bad");
    errorMessage("number to be a number above zero");
    setError(true);
    setDisableAddButton(true);
    }else{
	console.log("number ok");
        setError(false);
	    console.log(priceError);
        if(!priceError){ setDisableAddButton(false);}	
    }
    setNumber(event.target.value);
  };

  const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
	  console.log(event.target.value);
    if ( parseFloat(event.target.value) <=0 || isNaN(parseFloat(event.target.value))){
    console.log("price bad");
    errorMessage("Price needs to be a number above zero");
    setPriceError(true);
    setDisableAddButton(true);
    }else{
	console.log("price ok");
        setPriceError(false);
	    console.log(error);
	if(!error){ setDisableAddButton(false);}
    }
    setPrice(event.target.value);
  };

const order = async (payload) =>
 {
   console.log(payload);
   fetch('/api/user/newuser', {
    method: 'POST',
    credentials: 'include',
    mode: "cors",
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }
   )
    .then(res => {
            if(res.status === 200) {
            successMessage("order Complete");
            setDisableAddButton(true);
            }else{
            setSubmitted(false);
            setError("user facked");
            }
  }).catch(response =>{
    setError("portfolio failed");
          setSubmitted('none')
  }
  );
 }

const handleSubmit = () => {
  setSubmitted(true);
  if( error === false && priceError === false){
    var payload = {};
    payload['portfolio'] = assets;
    payload['seriesdataset'] = [];
    for(var key in assets){
      payload['seriesdataset'].push({"name" : key, "data" : [] });
    }
    console.log(payload);
    order(payload);
    onboarded(true);
    navigate("/");
  }
  else
  {
    console.log("error message");
  }
};

  const successMessage = () => {
    return (
      <div
        className="success"
        style={{
          display: submitted ? '' : 'none',
        }}>
           <p>Order created. You should receive a confirmation email shortly.</p>
      </div>
    );
  };

const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  console.log(event.target.value);
  if(event.target.value === ""){
    return;
  }
  API({
    url: '/ticker/suggest/' +event.target.value
  })
  .then(response => {
    if (response.statusText === "OK"){
    var options = "";

    for(const ticker of response.data){
        if(ticker['internalTicker'] === "VIX")
            continue;
        options += '{"value": "' + ticker['internalTicker'] + '" ,"label" : "' + ticker['internalTicker'] + '"},';
    }
    options = "[" + options.slice(0, -1)+ "]";
    console.log(JSON.parse(options));
    setTickersState(JSON.parse(options));
    setLoading(false);
    }
  })
};

const updateAssetsForUser = () =>{
  //setLoading(true);
  let values = "<h5>Your starting assets</h5><p>";
  for(var key in assets){
    setDisableSubmitButton(false);
    values+= key + " : " + assets[key] + " shares.<br>";
  }
  values+= "</p>";
  setAssetsText(values);
  console.log(values);
  //setLoading(false);
}
const handleAddAsset = () =>{
  console.log(ticker);
  let assetList = assets;
  assetList[ticker] = parseFloat(number);
  setAssets(assetList);
  console.log(assets);
  updateAssetsForUser();
}
const errorMessage = () => {
        return (
        <div
                className="error"
                style={{
                display: (error || priceError)? '' : 'none',
                }}>
                <p>Both order price and number of shares must be a number above zero</p>
        </div>
        );
};

if (isLoading) {
            return <div className="App">Loading...</div>;
          }
else{
  return (

<>
	  <ThemeProvider theme={darkTheme}>
              <Header navPosition="right" className="reveal-from-bottom" />
<main className="site-content">
  <div style={{ paddingTop: '100px' ,paddingRight: '100px' }}>
    <div className="container-xs">
        <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">Portfolio Setup</h1>
          Welcome to your new account. Let's set up your portfolio.
	  <div dangerouslySetInnerHTML={{ __html: assetsText }}></div>
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
    <TextField
    id="standard-basic"
    label="Search Ticker"
    variant="standard"
    onChange={handleSearch}
    />
      <div>
        <TextField
          id="outlined-select-currency-native"
          select
          label="Asset"
          value={ticker}
          onChange={handleChange}
          SelectProps={{
            native: true,
          }}
        >
          { tickersState.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TextField>
        <div>
          </div>
	  <TextField id="outlined-basic" label="Number Of Shares" variant="outlined" onChange={handleNumber} />
      </div>
      <div></div>
          <Button disabled={disableAddButton}
        onClick={() => {
          handleAddAsset();
        }}
      >
        Add Asset
      </Button>

      <Button disabled={disableSubmitButton}
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit Portfolio 
      </Button>
    </Box>
       <div className="success">{successMessage()}</div>
      <div className="error">{errorMessage()}</div>
    </div>
  </div>
<div style={{ paddingTop: '100px' ,paddingRight: '100px' }}></div>
</main>
	  </ThemeProvider>
</>

  );
}
}
export default New;
