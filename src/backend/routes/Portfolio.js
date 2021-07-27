
const router = require('express').Router();
let Portfolio = require('../model/Portfolio');
const User = require('../model/User');
const Jwt = require('jsonwebtoken');
const secret = 'passwordKey';

router.route('/').get((req, res) => {
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
        Portfolio.findOne({_id: decoded.email}, {"_id": 0})
      .then(portfolio => res.json(portfolio));
    }
    });
});

module.exports = router;
