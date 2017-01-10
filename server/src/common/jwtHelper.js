'use strict';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/get-config');

const EXPIRESTIME = 30*24*60*60*1000;
/*
 * Create a 32 bytes token - ASYNC
 * callback(err, token)
 */
exports.generateToken = function(user){
  return jwt.sign(user, config.secret, {
    expiresIn: EXPIRESTIME // in seconds
  });	
};

exports.setUserInfo = function(user){
  return {
    _id: user._id,
    userName: user.local.username,
    email: user.local.email,
    role: user.local.role || '',
  };
};