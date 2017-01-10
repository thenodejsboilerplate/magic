'use strict';
const JwtStrategy = require('passport-jwt').Strategy;  
const ExtractJwt = require('passport-jwt').ExtractJwt;  
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');  
const config = require('../config/get-config');

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {  

// Setting up local login strategy
  const localOptions = { usernameField: 'email' }; 
  const localLogin = new LocalStrategy(localOptions, function(email, password, done) {  
    User.findOne({ email: email }, function(err, user) {
      if(err) { return done(err); }
      if(!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

      user.comparePassword(password, function(err, isMatch) {
        if (err) { return done(err); }
        if (!isMatch) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

        return done(null, user);
      });
    });
  });


// Setting up JWT login strategy
  const jwtOptions = {  
  // Telling Passport to check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
    secretOrKey: config.secret
  };
  const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {  
    console.log(payload);
    User.findById(payload._id, function(err, user) {
      if (err) { return done(err, false); }

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  });
  
//allow passport to use the strategies we defined
  passport.use(jwtLogin);  
  passport.use(localLogin);  
  // let opts = {};
  // opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  // opts.secretOrKey = config.secret;
  // passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  //   console.log(`jwt_payload ${JSON.stringify(jwt_payload, null, ' ')}  id ${jwt_payload.id}`);
  //   User.findOne({id: jwt_payload.id}, function(err, user) {
  //     if (err) {
  //       return done(err, false);
  //     }
  //     if (user) {
  //       done(null, user);
  //     } else {
  //       done(null, false);
  //     }
  //   });
  // }));
};