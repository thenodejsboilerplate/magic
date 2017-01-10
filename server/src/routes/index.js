'use strict';
const	{basename, extname} = require('path');
const	{readdir} = require('../../src/common/filesystem');

module.exports = function (app){
  readdir('src/routes')
  .filter(file => extname(file) === '.js' && basename(file) !== 'index.js')
  .forEach(file => require(file)(app));
};