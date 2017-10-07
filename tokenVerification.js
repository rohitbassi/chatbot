var route = require('express')();
var express = require('express');
var middleRoutes = express.Router();
route.set('secret', '37LvDSm4XvjYOh9Y');
var jwt = require('jsonwebtoken');
middleRoutes.use(function (req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, route.get('secret'), function (err, decoded) {
      if (err) {
        //return res.json({ success: false, message: 'Failed to authenticate token.' });
        return res.status(403).send({
      success: false,
      message: 'Failed to authenticate token.'
    });
      }
      else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  }
  else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});



module.exports = middleRoutes;