import { useState } from 'react';
import classNames from 'classnames';
import Input from '../components/elements/Input';
export default function Form() {

// States for registration
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// States for checking the errors
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState(false);


const register = async (event) =>
 {
   fetch('/api/user/register', {
    method: 'POST',
    credentials: 'include',
    mode: "cors",
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
       'name' : name,
       'email' : email,
       'password' : password,
    })
  }
   )
    .then(res => {
  return res;
  });
 }

// Handling the name change
const handleName = (e) => {
	setName(e.target.value);
	setSubmitted(false);
};

// Handling the email change
const handleEmail = (e) => {
	setEmail(e.target.value);
	setSubmitted(false);
};

// Handling the password change
const handlePassword = (e) => {
	setPassword(e.target.value);
	setSubmitted(false);
};

// Handling the form submission
const handleSubmit = (e) => {
	e.preventDefault();
	if (name === '' || email === '' || password === '') {
	setError(true);
	} else {
	register();
	setSubmitted(true);
	setError(false);
	}
};

  // Showing success message
  const successMessage = () => {
    return (
      <div
        className="success"
        style={{
          display: submitted ? '' : 'none',
        }}>
        <h1>User {name} successfully registered!!</h1>
      </div>
    );
  };

// Showing error message if error is true
const errorMessage = () => {
	return (
	<div
		className="error"
		style={{
		display: error ? '' : 'none',
		}}>
		<h1>Please enter all the fields</h1>
	</div>
	);
};

  return (
    <div className="form">
    <div className="container-xs">
    <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
    Registration
    </p>
    <div className="container-xs">
    <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
    It's free if you know me.
    </p>

      {/* Calling to the methods */}
      <div className="messages">
        {errorMessage()}
        {successMessage()}
      </div>
 
      <form>
        {/* Labels and inputs for form data */}
        <Input onChange={handleName} placeholder="User name" className="input"
          value={name} type="text" />
 
        <Input onChange={handleEmail} placeholder="Email" className="input"
          value={email} type="email" />
 
        <Input onChange={handlePassword} placeholder="Password" className="input"
          value={password} type="password" />
 
        <Input onClick={handleSubmit} className="btn" type="submit" value="Register your interest"/>
      </form>
    </div>
</div>
</div>
  );
}
