const router = require('express').Router();
let Portfolio = require('../model/Portfolio');
let Command = require('../model/Command');
const User = require('../model/User');
const Volume = require('../model/Volume');
const Jwt = require('jsonwebtoken');
var crypto = require("crypto");
var amqp = require('amqplib/callback_api');

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
      const user = new User(req.body);
      //adding default variables
      user.enabled = crypto.randomBytes(40).toString('hex');
      user.tags = ["all"];
      user.dailySecret = "/";
      user.onboarded = "false";
      user.emailSent = "false";
      user.emailConfirmed =  crypto.randomBytes(40).toString('hex');
      user.save(function(err) {
        if (err) {
          res.status(500).json("error registering user");
        }else{
          res.status(200).json("done");
amqp.connect('amqp://messenger:MessengerPassword@localhost:5672', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'onboarding';
    var msg = '{ "command" : "confirm_email", "email" : "'+email+'", "secret" : "'+user.emailConfirmed+'", "user" : "'+name+'"}';

    //channel.assertQueue(queue, {
    //  durable: true
    //});

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
});

      }
    });
});

router.route('/confirm/:query').get((req, res) => {
  var query = req.params['query'];

      User.findOne({"emailConfirmed" : query}, function(err, user) {
       if (!user) {
        console.log("no user");
        res.status(404)
          .json({
          error: 'nope'
        });
      } else {
	user.emailConfirmed = "true";
	user.save();
        res.status(200).send('<h1>Email confirmed</h1>You can now <a href="https://makingmymatesrich.com">Log In to makingmymatesrich.com</a>');
      }
      });
      });

router.route('/confirmadmin/:query').get((req, res) => {
  var query = req.params['query'];

      User.findOne({"enabled" : query}, function(err, user) {
       if (!user) {
        console.log("no user");
        res.status(404)
          .json({
          error: 'nope'
        });
      } else {
        user.enabled = "true";
        user.save();
        res.status(200).send('<h1>User Enabled</h1>');
      }
      });
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
amqp.connect('amqp://messenger:MessengerPassword@localhost:5672', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'onboarding';
    var msg = '{ "command" : "confirm_onboarded", "portfolio" : '+JSON.stringify(newPortfolio)+', "volume" : '+JSON.stringify(volume)+', "enabled" : "'+ user.enabled+'" }';

    //channel.assertQueue(queue, {
    //  durable: false
    //});

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
});
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
