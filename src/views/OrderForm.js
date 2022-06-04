import * as React from 'react';
import  API from '../Api';
import Header from '../components/layout/HeaderLoggedIn';
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

const orderTypes = [
  {
    value: 'buy',
    label: 'BUY',
  },
  {
    value: 'sell',
    label: 'SELL',
  },
];


const OrderForm = ({email}) => {
  const [ticker, setTicker] = React.useState('AAPL');
  const [tickersState, setTickersState] = React.useState('');
  const [orderType, setOrderType] = React.useState('buy');
  const [number, setNumber] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [priceError, setPriceError] = React.useState(false);
  const [disableButton, setDisableButton] = React.useState(true);
  const [isLoading, setLoading] = React.useState(true);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(event.target.value);
  };
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
    errorMessage("Price number to be a number above zero");
    setError(true);
    setDisableButton(true);
    }else{
	console.log("number ok");
        setError(false);
	    console.log(priceError);
        if(!priceError){ setDisableButton(false);}	
    }
    setNumber(event.target.value);
  };

  const handlePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
	  console.log(event.target.value);
    if ( parseFloat(event.target.value) <=0 || isNaN(parseFloat(event.target.value))){
    console.log("price bad");
    errorMessage("Price needs to be a number above zero");
    setPriceError(true);
    setDisableButton(true);
    }else{
	console.log("price ok");
        setPriceError(false);
	    console.log(error);
	if(!error){ setDisableButton(false);}
    }
    setPrice(event.target.value);
  };

const order = async (payload) =>
 {
   fetch('/api/order', {
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
            setDisableButton(true);
            }else{
            setSubmitted(false);
            setError("order fauked");
            }
  }).catch(response =>{
    setError("Order failed");
          setSubmitted('none')
  }
  );
 }

const handleSubmit = () => {
  setSubmitted(true);
  if( error === false && priceError === false){
    var payload = {
      email: email,
      order: orderType,
      ticker: ticker,
      price: parseFloat(price),
      volume: parseFloat(number),
    };
    console.log(payload);
    order(payload);
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
        <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">Order Form</h1>
          This is an asyncronous service. Your order will be queued.
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
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
        <TextField
          id="outlined-select-currency-native"
          select
          label="Order Type"
          value={orderType}
          onChange={handleOrderType}
          SelectProps={{
            native: true,
          }}
        >
          {orderTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option> 
	  ))}
        </TextField>
	  <InputLabel htmlFor="outlined-adornment-amount">Total price for all shares</InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
	  label="Total price for all shares"
          value={price}
          onChange={handlePrice}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
        />
	<InputLabel htmlFor="outlined-adornment-amount">
          Number of Shares
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
	  label="Number of Shares"
          value={number}
          onChange={handleNumber}
          startAdornment={<InputAdornment position="start"></InputAdornment>}
        />
      </div>
      <div></div>
      <Button disabled={disableButton}
        onClick={() => {
          handleSubmit();
        }}
      >
        Submit Order
      </Button>
    </Box>
       <div className="success">{successMessage()}</div>
      <div className="error">{errorMessage()}</div>
    </div>
  </div>
</main>
	  </ThemeProvider>
</>

  );
}
}
export default OrderForm;
