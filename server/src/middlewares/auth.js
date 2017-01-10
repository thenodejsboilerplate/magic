'use strict';
const logger = require('../libs/logger'),
  resultWrapper = require('../common/wrapResult');
module.exports = {
	// route middleware to make sure a user is logged in
  // isLoggedIn: (req, res, next)=> {

	// 	// if user is authenticated in the session, carry on 
  //   if (req.isAuthenticated()){ 
  //     return next();
  //   }else{
  //     req.flash('error','请先登录!');
	// 			// if they aren't redirect them to the home page
  //     res.redirect('/user/login');
  //   }

  // },

  // notLoggedIn: (req, res, next)=> {

	// 	// if user is authenticated in the session, carry on 
  //   if (req.isAuthenticated()){
  //     req.flash('error','已经登录了哦!');
	// 		// if they aren't redirect them to the home page
  //     res.redirect('back');
  //   }else{
  //     return next();
  //   }

  // },
		/***
		 * roles @params: Array
		 */
  allow: (roles)=> {
    return function(req,res,next){
      if(req.user){
        let user      = req.user.processUser(req.user);
        let roleExist = roles.some(function(v){
          return user.roles.join(',').includes(v);
        });
						// let roleExist = roles.split(',').every(function(v){
							
						// 	user.roles.indexOf(v) !== -1;

						// });
        if(roleExist){
          logger.debug('');
          return next();
        }else{
          res.status(401).send(resultWrapper({}, -1,'You are not authorized to view this content.' ));
          return next('Unauthorized');				
        }
      }else{
        res.send(resultWrapper({}, -1,'You need to log in first!' ));
        return next('Unauthorized');	
      }				
    };

			
  },



		
}; 