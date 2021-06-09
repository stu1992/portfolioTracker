
const router = require('express').Router();
let Portfolio = require('../model/Portfolio');
const User = require('../model/User');
const Jwt = require('jsonwebtoken');

const secret = 'mysecretsshhh';

router.route('/login').post((req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
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
            User.findOne({email: decoded.email}, {"_id": 0, "password": 0})
          .then(portfolio => res.json(portfolio));
        }
        });
    });

/*
    router.route('/register').post((req, res) => {
      const { email, password, name} = req.body;
      console.log(req.body)
      const user = new User(req.body);
      user.save(function(err) {
        if (err) {
          res.status(500).json("error registering user");
        }else{
          res.status(200).json("done");
        }
        })
    });
    router.route('/logout').get((req, res) => {
      console.log("logging out");
          res.cookie('token', "expired", { httpOnly: true }).sendStatus(200);
        });
  */

module.exports = router;
