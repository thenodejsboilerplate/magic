'use strict';
const co = require('co'),
  logger = require('../libs/logger'),
  serverName = require('os').hostname(),
  env = process.env.NODE_ENV || 'test';

module.exports = (handle) => {
  return (req, res, next) => {
    co(handle(req, res, next))
            .catch((err) => {
              logger.error(`error in coWrapper fucntion: ${err.message} ${err.stack}`);
              if(env ==='test'|| env === 'develop'){
                logger.error({
                  req,
                  err,
                  serverName: serverName,
									//cluster: cluster.worker && cluster.worker.id
                });
                res.json({
                  Code: -1,
                  Message: '操作失败 ' + err.stack
                });
              }else if(env === 'production'){
                res.json({
                  Code: -1,
                  Message: '操作失败 '
                });                  
              }

            });
  };
};