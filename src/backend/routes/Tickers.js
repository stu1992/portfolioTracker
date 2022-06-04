const router = require('express').Router();
let tickers = require('../model/Ticker');
const User = require('../model/User');
const Jwt = require('jsonwebtoken');

const secret = 'passwordKey';

router.route('/suggest/:query').get((req, res) => {
  console.log(req.params);
  console.log(req.headers.cookie);
  var query = req.params['query'];
  var token = req.headers.cookie.substring(6);
  console.log(token);
  Jwt.verify(token, secret, function(err, decoded) {
    if (err) {
      console.log("invalid token");
      res.status(401).send('Unauthorized: Invalid token');
    } else {
      tickers.find({"search" : {$regex: query, $options: 'i'}}, {"_id" : 0, "service" : 0, "search" : 0, "mappedTicker" : 0, "usCurrency" : 0})
      .then(tickers => res.json(tickers))
    }
  });
});

router.route('/').get((req, res) => {
  console.log(req.headers.cookie);
  var token = req.headers.cookie.substring(6);
  console.log(token);
  Jwt.verify(token, secret, function(err, decoded) {
    if (err) {
      console.log("invalid token");
      res.status(401).send('Unauthorized: Invalid token');
    } else {
      tickers.distinct("internalTicker")
      .then(tickers => res.json(tickers))
    }
  });
});
module.exports = router;
