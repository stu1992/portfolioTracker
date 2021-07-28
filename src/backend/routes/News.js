const router = require('express').Router();
let News = require('../model/News');
const User = require('../model/User');
const Jwt = require('jsonwebtoken');

const secret = 'passwordKey';
router.route('/').get((req, res) => {

  var token = req.headers.cookie.substring(6);
  console.log(token);
  Jwt.verify(token, secret, function(err, decoded) {
    if (err) {
      console.log("invalid token");
      res.status(401).send('Unauthorized: Invalid token');
    } else {
      console.log(decoded.email);
      var tags
      User.findOne({email: decoded.email}, {"_id": 0, "password": 0, "__v" : 0})
      .then(user =>
      News.find({tags : {$in : user.tags}}, {"_id": 0}).sort({"date":-1}).limit(6)
    .then(news => res.json(news))
    );
  }
  });


});

module.exports = router;
