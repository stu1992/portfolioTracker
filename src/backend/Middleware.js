// middleware.js
const Jwt = require('jsonwebtoken');
const secret = 'passwordKey';
const withAuth = function(req, res, next) {
  const token = req.cookies.token;  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    Jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
}
module.exports = withAuth;
