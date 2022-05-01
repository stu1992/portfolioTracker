import { useState } from 'react';
import classNames from 'classnames';
import Input from '../components/elements/Input';
import Header from '../components/layout/HeaderLoggedIn';
import Form from "@rjsf/core";
import JSONSchemaForm from 'react-jsonschema-form';
const OrderForm = ({email}) => {

//const {default: Form} = JSONSchemaForm;
// States for registration

// States for checking the errors
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState(false);


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
    "enum": ["VUG", "GME", "BRK-B", "AAPL"]
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
}
;
  const successMessage = (payload) => {
	  var message = payload;
    return (
      <div
        className="success"
        style={{
          display: submitted ? '' : 'none',
        }}>
	    <p>Order created. Visit rabbit and paste in payload box with persistent Delivery mode.</p>
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
//submit(payload);
navigator.clipboard.writeText(JSON.stringify(payload));
	successMessage(payload);

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
    <div style={{ paddingTop: '100px' }}>
    <div className="form">
    <div className="container-xs">
    <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
    Order Form (beta)
    </h1>
    <div className="container-xs">
    <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
On submission, your order will be copied to your clipboard.
    </p>
	  <Form schema={schema} 
onChange={handleChange}
        onSubmit={handleSubmit}
        onError={handleError}
	  />
	          <div className="success">
        {successMessage()}
      </div>
    </div>
</div>
</div>
          </div>
          </main>
</>
  );
}
export default OrderForm;
