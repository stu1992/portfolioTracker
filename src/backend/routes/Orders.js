const router = require('express').Router();
let Order = require('../model/Order');
const User = require('../model/User');
const Jwt = require('jsonwebtoken');

const secret = 'passwordKey';

router.route('/').post((req, res) => {
      console.log(req.body)
      let requestOrder = new Order(req.body);
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
            if(decoded.email != requestOrder['email']){
              res.status(401).send('Unauthorized: go fuck yourself');
	    }else{
            requestOrder.save(function(err) {
        if (err) {
          res.status(500).json("error commiting order");
        }else{
          res.status(200).json("done");
        }
        })
            //Order.insert(requestOrder)
         //.then(requestOrder => res.json(requestOrder));
	    }
        }
        });
    });
module.exports = router;
