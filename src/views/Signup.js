import { useState } from 'react';
import classNames from 'classnames';
import Input from '../components/elements/Input';
import Header from '../components/layout/Header';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function Form() {

const [disableButton, setDisableButton] = useState(false);
// States for registration
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

// States for checking the errors
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState(false);

function Mailto({ email, subject, body, ...props }) {
  return (
    <a href={`mailto:${email}?subject=${subject || ""}&body=${body || ""}`}>
      {props.children}
    </a>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

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
	    if(res.status === 200) {
	    setSubmitted(true);
	    setDisableButton(true);
	    }else{
	    setSubmitted(false);
	    setError("Registration error");
	    }
  }).catch(response =>{
    setError("Registration failed");
	  setSubmitted('none')
  }
  );
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
	setError("Please enter values");
	} else if(!email.toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ))
	{
        setError("enter valid email");
	}else if (password.length <8)
        {
          setError("Please make a longer password");
        }else{
	register();
		//setSubmitted(true);
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
        <p>Thanks, {name}. You will recieve an email shortly to activate your account.</p>
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
		<p>{error}</p>
	</div>
	);
};

  return (
	  <>
          <ThemeProvider theme={darkTheme}>
	      <Header navPosition="right" className="reveal-from-bottom" />
    <main className="site-content">
    <div style={{ paddingTop: '100px' }}>
    <div className="form">
    <div className="container-xs">
    <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
    Registration
    </h1>
    <div className="container-xs">
	  

      {/* Calling to the methods */}
      <div className="messages">
        {errorMessage()}
        {successMessage()}
      </div>
 
<Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
<TextField id="outlined-basic" label="Name" variant="outlined" value={name} onChange={handleName} />
<TextField id="outlined-basic" label="Email" variant="outlined" value={email} onChange={handleEmail} />
<TextField id="outlined-basic" label="Password" type="password" variant="outlined" value={password} onChange={handlePassword} />
<br/>
<Button
disabled={disableButton}
onClick={handleSubmit}
>
Register Account
</Button>
<Button onClick={() => window.location = 'mailto:makingmymatesrich@gmail.com?subject=help with my sign up'}>
Ask for help
</Button>
</Box>
	      <div className="container-xs">
	<p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
    Get access to exclusive investment insights, compare your results and be motivated by others.
    </p>
	  </div>
    </div>
</div>
</div>
	  </div>
	  </main>
</ThemeProvider>
</>
  );
}
