
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
              expiresIn: '1h'
            });
            res.cookie('token', token, { httpOnly: true }).sendStatus(200);
          }
        });
      }
    });
    console.log("done");
    });


module.exports = router;
