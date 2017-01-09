// ./models/User.js
'use strict';
const mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  moment = require('moment'),
  helper = require('../libs/utility'),
     // logger = require('./logger'),
  Schema = mongoose.Schema;

// create a schema
// The allowed SchemaTypes are:
// String
// Number
// Date
// Buffer
// Boolean
// Mixed
// ObjectId
// Array
var userSchema = new Schema({
  local: {
          // name: String,
    username: {
      type: String,
      required: [true, 'Username is required!'],
      unique: true
    },
    email: { type: String, required: true, unique: true, min: 4 },
    password: { type: String, required: true }, //, match: /[0-9a-zA-Z_-]/
    active: {type: Boolean, required: true, default: true },
    created_at: Date,
    updated_at: Date
  },
  github: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

// on every save, add the date
userSchema.pre('save', function (next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date: do not leave .local
  this.local.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at) {
    this.local.created_at = currentDate;
  }

  next();
});

// pre and post save() hooks are not executed on update(), findOneAndUpdate() etc
userSchema.pre('update', function (next) {
  let now = Date.now();
  this.update({'_id': this._id}, {$set: {'updated_at': now}});
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  let now = Date.now();
  this.update({'_id': this._id}, {$set: {'updated_at': now}});
  next();
});

// methods ======================


userSchema.methods({
  // generating a hash
  generateHash: password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },  
// checking if password is valid

// in arrow-functions , the 'this'' value of the following statement is : window; // or the global object
// as to arrow function inside a function,  it's the this of the outer function
// arrow function expressions are best suited for non-method functions.
  validPassword: function (password) {
    return bcrypt.compareSync(password, this.local.password);
  },

  time: time => {
    return moment(time).format('L');
  },

  processUser: user => {
    return {
      _id: user._id,
      username: user.local.username,
      email: user.local.email,
      active: user.local.active,
      created_at: moment(user.local.created_at).format('L'),
      updated_at: moment(user.local.updated_at).format('L')

    };
  }

});

// the schema is useless so far
// we need to create a model using it

// make this available to our users in our Node applications
module.exports = mongoose.model('User', userSchema);
