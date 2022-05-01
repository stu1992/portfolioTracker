import { useState } from 'react';
import classNames from 'classnames';
import Input from '../components/elements/Input';
import Header from '../components/layout/HeaderLoggedIn';
import Form from "@rjsf/bootstrap-4";
import JSONSchemaForm from 'react-jsonschema-form';
const OrderForm = ({email}) => {

//const {default: Form} = JSONSchemaForm;
// States for registration

// States for checking the errors
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState(false);

const order = async (payload) =>
 {
   fetch('/api/order', {
    method: 'POST',
    credentials: 'include',
    mode: "cors",
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }
   )
    .then(res => {
            if(res.status === 200) {
            setSubmitted(true);
            successMessage("order Complete");
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
const schema =
{
  "type": "object",
  "required": [
    "ticker",
    "orderType",
    "price",
    "number"
  ],
  "properties": {
    "ticker": {
      "title": "Ticker",
        "type": "array",
        "maxItems": 1,
  "items": {
    "type": "string",
    "enum": ["VUG", "GME", "BRK-B", "AAPL", "BTC", "ETH"]
  },
  
  "uniqueItems": true
    },
    "orderType": {
      "title": "Order Type",
  "type": "array",
  "maxItems": 1,
  "items": {
    "type": "string",
    "enum": ["buy", "sell"]
  },
  "uniqueItems": true
    },
    "number": {
      "type": "number",
      "title": "Number of Shares"
    },
    "price": {
      "type": "number",
      "title": "Price"
    }
}
};

const ui = {
  };
  const successMessage = (payload) => {
	  var message = payload;
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
const handleSubmit = (e) => {
        console.log("submitted");
	setSubmitted(true);
	var payload = {
"email":email,
"order":e.formData['orderType'][0],
"ticker":e.formData['ticker'][0],
"price":e.formData['price'],
"volume":e.formData['number']
};
console.log(payload);
order(payload);
};

const handleError = (e) => {
        console.log("error");
};

const handleChange = (e) => {
	console.log("changed");
};
// Handling the form submission
  return (
	  <>
              <Header navPosition="right" className="reveal-from-bottom" />
<main className="site-content">
  <div style={{ paddingTop: '100px' ,paddingRight: '100px' }}>
    <div className="container-xs">
        <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">Order Form (beta)</h1>
          This is an asyncronous service. Your order will be queued.
	  <Form schema={schema} 
          onChange={handleChange}
          onSubmit={handleSubmit}
          onError={handleError}
	  uiSchema={ui}
	  />
	<div className="success">{successMessage()}</div>
    </div>
  </div>
</main>
</>
  );
}
export default OrderForm;
