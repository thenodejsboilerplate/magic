'use strict';
const jwt = require('jsonwebtoken'); 
const User = require('../models/User');
//const config = require('../config/get-config');
const passport = require('passport'); 
const coWrapper = require('../common/coWrapper');
const jwtHelper = require('../common/jwtHelper');
const wrapResult = require('../common/wrapResult');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });  
const requireLogin = passport.authenticate('local', { session: false });


const myProtected = coWrapper(function*(req, res, next){
  let reqToken = req.headers.Authorization;
  let userInfo = jwtHelper.setUserInfo(req.user);
  let serverToken = `JWT ${jwtHelper.generateToken(userInfo)}`;
  if(!(reqToken === serverToken) ){
    console.log('token not matched or not existing!');
    res.json(wrapResult({},-1,'token not matched or not existing!'));
  }else{
    console.log('the classified content is shown because of the matching token' );
    res.json({content: 'the classified content is shown because of the matching token '});
  }
});
/*
 * login controller 
 */
const login = coWrapper(function*(req, res, next){
  let user = yield User.findOne({'local.email': req.body.email}).exec();
  let userInfo = jwtHelper.setUserInfo(user);

  res.json({
    token: `JWT ${jwtHelper.generateToken(userInfo)}`,
    user: userInfo
  });
});


/*
 * Registration controller
 */
const register = coWrapper(function*(req, res, next){
  let email = req.body.email,
    password = req.body.password,
    username = req.body.username;

  if(!email || !password || !username) {
    res.json(wrapResult({},-1,'Please enter email, password or username!'));
  } else {

    User.findOne({'email': email}, function(err, existingUser){
      if(err) {
        return next(err);
      }
      // If user is not unique, return error
      if(existingUser){
        return res.send(wrapResult({},-1, 'That email address is already in use.'));
      }

     // If email is unique and password was provided, create account
      var newUser = new User({
        'local.username': username,				
        'local.email': email,
        'local.password': password
      });
          // Attempt to save the user
      newUser.save(function(err, user) {
        if (err) {
          console.log(`newUser.save error ${err.stack,err.message}`);
          return res.json(wrapResult({},-1,'That email address already exists.'));
        }

       // Respond with JWT if user was created
        let userInfo = jwtHelper.setUserInfo(user);
        res.json(wrapResult({
          token: 'JWT ' + jwtHelper.generateToken(userInfo),
          user: userInfo
        }));

        // res.json(wrapResult({},1,'Successfully created new user..'));
      });

    });

  }		
});

// const authenticate = coWrapper(function*(req, res, next){
// 	//Mongoose queries are not promises. However, they do have a .then() function for yield and async/await. If you need a fully-fledged promise, use the .exec() function./ A query is not a fully-fledged promise, but it does have a `.then()`.
//   let myPassword = password; 
//   console.log(`email ${email}; password ${myPassword}`);
//   const user = yield User.findOne({'local.email': email}).exec();

//   if (!user) {
//     res.send({ success: false, message: 'Authentication failed. User not found.' });
//   } else {
// 					// Check if password matches
// 		console.log(`user ${JSON.stringify(user)}`);
//     user.comparePassword(myPassword, function(err, isMatch) {
//       if (isMatch && !err) {
// 							// Create token if the password matched and no error was thrown
// 							// If the passwords match and no errors have been thrown, our jsonwebtoken package will encode a JSON Web Token (JWT) that expires in a week. It will return JSON output that can be used for authenticating our user.
// 				console.log(`isMatch ${JSON.stringify(isMatch)}`);


// 							// sign asynchronously
//         jwt.sign(user, config.secret, {
//           expiresIn: 60*60*60*1000
// 								// in seconds , expressed in seconds or a string describing a time span rauchg/ms. Eg: 60, "2 days", "10h", "7d"
//         }, function(err, token) {
//           if(err) throw err;
// 					//console.log(`token: ${token}`);
//           console.log(`req after jwt.sign() is ${req};`);
//           res.json({ success: true, token: 'JWT ' + token });
//         });

// 				//sync version
// 				// var token = jwt.sign(user, config.secret, {
// 				//   expiresIn: 10080 // in seconds , expressed in seconds or a string describing a time span rauchg/ms. Eg: 60, "2 days", "10h", "7d"
// 				// });

//       } else {
//         console.log('Authentication failed. Passwords did not match');
//         res.send({ success: false, message: 'Authentication failed. Passwords did not match.' });
//       }
//     });
//   }
// });

// Protect dashboard route with JWT
// const dashboard = coWrapper(function*(req, res, next){
//   res.send('It worked! User id is: ' + req.user._id + '.');
// });


module.exports   = function(server) {
  server.post('/api/auth/register', register);
  server.post('/api/auth/login', login);
  server.get('/api/auth/protected', myProtected);
  //server.post('/user/authenticate', authenticate);
  //server.get('/user/dashboard', passport.authenticate('jwt', { session: false }), dashboard);
};