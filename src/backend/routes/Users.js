const router = require('express').Router();
let Portfolio = require('../model/Portfolio');
const User = require('../model/User');
const Volume = require('../model/Volume');
const Jwt = require('jsonwebtoken');

const secret = 'passwordKey';

router.route('/login').post((req, res) => {
  const { email, password } = req.body;
    User.findOne({ email }, function(err, user) {
      if (err) {
        console.error(err);
        res.status(500)
          .json({
          error: 'Internal error please try again'
        });
      } else if (!user) {
        console.log("no user");
        res.status(401)
          .json({
          error: 'Incorrect email or password'
        });
      } else {
        user.isCorrectPassword(password, function(err, same) {
          if (err) {
            console.log("password");
            res.status(500)
              .json({
              error: 'Internal error please try again'
            });
          } else if (!same) {
            console.log("either");
            res.status(401)
              .json({
              error: 'Incorrect email or password'
            });
          } else if ( user.emailConfirmed == "false" ){
	    console.log("not enabled");
	    res.status(401)
              .json({
              error: 'Account disabled. Contact Stu'
            });
	  } else {
            console.log("loggin in");
            // Issue token
            const payload = { email };
            const token = Jwt.sign(payload, secret, {
              expiresIn: '1d'
            });
            res.cookie('token', token, { httpOnly: true }).sendStatus(200);
          //  res.send({'token': token});
          }
        });
      }
    });
    console.log("done");
    });

    router.route('/get/').get((req, res) => {
      console.log("getting user");
          //  const token = req.cookies.token;  if (!token) {
        console.log(req.headers.cookie);
        var token = req.headers.cookie.substring(6);
        console.log(token);
        Jwt.verify(token, secret, function(err, decoded) {
          if (err) {
            console.log("invalid token");
            res.status(401).send('Unauthorized: Invalid token');
          } else {
            console.log(decoded.email);
            User.findOne({email: decoded.email}, {"_id": 0, "password": 0, "__v" : 0})
          .then(portfolio => res.json(portfolio));
        }
        });
    });


    router.route('/register').post((req, res) => {
      const { email, password, name} = req.body;
      console.log(req.body)
      const user = new User(req.body);
      //adding default variables
      user.enabled = "false";
      user.tags = ["all"];
      user.dailySecret = "/";
      user.onboarded = "false";
      user.emailConfirmed = "true";
      user.save(function(err) {
        if (err) {
          res.status(500).json("error registering user");
        }else{
          res.status(200).json("done");
        }
        })
    });

router.route('/newuser').post((req, res) => {
  console.log("getting user");
  //  const token = req.cookies.token;  if (!token) {
  console.log(req.headers.cookie);
  var token = req.headers.cookie.substring(6);
  console.log(token);
  Jwt.verify(token, secret, function(err, decoded) {
  if (err) {
    console.log("invalid token");
    res.status(401).send('Unauthorized: Invalid token');
  } else {
   var dailySecret = "iderpasdfoij";
   User.findOne({email: "stumay1992@gmail.com"}, {"password": 0, "__v" : 0})
  .then(user =>{ dailySecret = user.dailySecret;});
  console.log(dailySecret);
   User.findOne({email: decoded.email}, {"password": 0, "__v" : 0})
  .then(user =>{
    if(user.onboarded === "true"){
      res.status(404).json("Already set up");
      return;
    }
    let newPortfolio = new Portfolio();
    newPortfolio._id = decoded.email;
    newPortfolio.portfolio = req.body['portfolio'];
    newPortfolio.seriesdataset = req.body['seriesdataset'];
    console.log(newPortfolio.portfolio);
    newPortfolio.save(function(err) {
      if (err) {
        console.log(err);
        res.status(500).json("error commiting portfolio");
      }else{
        let volume = new Volume();
        volume._id = decoded.email;
        console.log(volume);
        volume.save(function(err) {
          if (err) {
            console.log(err);
            res.status(500).json("error commiting portfolio");
          }
        });
        res.status(200).json("done");
	user.onboarded = "true";
	user.histSecret = "/static/media/example_hist.png";
	user.dailySecret = dailySecret;
	user.save();
      }
    });
  });
 }});
    });

    router.route('/logout').get((req, res) => {
      console.log("logging out");
          res.cookie('token', "expired", { httpOnly: true }).sendStatus(200);
        });


module.exports = router;
