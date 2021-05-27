
const router = require('express').Router();
let Portfolio = require('../model/Portfolio');
const User = require('../model/User');
const Jwt = require('jsonwebtoken');
const secret = 'mysecretsshhh';

router.route('/:id').get((req, res) => {
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
        Portfolio.findOne({_id: decoded.email})
      .then(portfolio => res.json(portfolio));
    }
    });
});

router.route('/test/').get((req, res) => {
  //const token = req.cookies.token;  if (!token) {
    //console.log("noo token");

    res.status(200).send('yes');
  //} else {
    //Jwt.verify(token, secret, function(err, decoded) {
      //if (err) {
      //  console.log("invalid token");
    //    res.status(401).send('Unauthorized: Invalid token');
    //  } else {
      //  console.log("valid tttttttttttttttttttken");
      //    Portfolio.findById(req.params.id)
    //    .then(portfolio => res.json(portfolio));
  //    }
  //  })
//  }
});

/*
router.route('/register').post((req, res) => {
  //const {email, password } = req.body;
  const userdata = {"email": "Kiana", "password": "password"}
  console.log(req.body);
  const user = new User(userdata);
  user.save(function(err) {
    if (err) {
      res.status(500).json("error registering user1");
    }else{
      res.status(200).json("done");
    }
    })
});
*/

module.exports = router;
