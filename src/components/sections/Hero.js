import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';
import Modal from '../elements/Modal';
import Input from '../elements/Input';
import Login from '../Login';
import marketImg from './../../market.png';

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}



const Hero = ({
  name,
  loggedInCallBack,
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {

  const [videoModalActive, setVideomodalactive] = useState(false);
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");

 const userDetails = async (event) =>
  {
    fetch('/api/user/get', {
     method: 'GET',
     credentials: 'include',
     mode: "cors",
     headers: {
       'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
     }
    })
    .then(res => {
  return res;
   });
  }

  const onSubmit = (event) => {
  event.preventDefault();
  fetch('/api/user/login', {
    method: 'POST',
    body: JSON.stringify({"email": userEmail, "password": userPassword}),
    credentials: 'include',
    mode: "cors",
    headers: {
      'Content-Type': 'application/json',
       'Access-Control-Allow-Origin': '*'
    }
  })
  .then(res => {
    if (res.status === 200) {
      console.log("client loging success!");
      const response = userDetails();
      console.log(response);
      loggedInCallBack(true);
    //  this.props.state['loggedin'] = true;
    } else {
      //TODO incorrect password modal
  console.log("incorrect username or password");
    }
  });
}

 const emailHandler = (event) =>{
   setEmail(event.target.value);
 }

 const passwordHandler = (event) =>{
   setPassword(event.target.value);
 }

  const openModal = (e) => {
    e.preventDefault();
    setVideomodalactive(true);
  }

  const closeModal = (e) => {
    e.preventDefault();
    setVideomodalactive(false);
  }

  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );


  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-delay="200">
              Making My Mates Rich!!
            </h1>
            <div className="container-xs">
              <p className="m-0 mb-32 reveal-from-bottom" data-reveal-delay="400">
                A 4 step program to long term returns
                </p>
              <div className="reveal-from-bottom" data-reveal-delay="600">
                <form onSubmit={onSubmit}>
                  <h1>Login Below!</h1>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    onChange={emailHandler}
                    required
                  />
                <Input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    onChange={passwordHandler}
                    required
                  />
                <Input type="submit" value="Submit"/>
                </form>
              </div>
            </div>
          </div>
          <div className="hero-figure reveal-from-bottom illustration-element-01" data-reveal-value="20px" data-reveal-delay="800">
              <Image
                className="has-shadow"
                src={marketImg}
                alt="Hero"
                width={896}
                height={504} />
          </div>
        </div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
