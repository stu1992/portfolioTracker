const router = require('express').Router();
let Order = require('../model/Order');
const User = require('../model/User');
const Jwt = require('jsonwebtoken');
var amqp = require('amqplib/callback_api');

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
	    amqp.connect('amqp://messenger:MessengerPassword@localhost:5672', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'order';
    var msg = '{ "email" : "'+requestOrder['email']+'", "order" : "'+requestOrder['order']+'", "ticker" : "'+requestOrder['ticker']+'", "price" : '+requestOrder['price']+', "volume" : '+requestOrder['volume']+' }';

    //channel.assertQueue(queue, {
    //  durable: false
    //});

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
});
		    res.status(200).send();
	    }
        }
        });
    });
module.exports = router;
