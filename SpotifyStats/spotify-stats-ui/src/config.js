const merge = require('lodash/merge');
const global = require('./Config/global');

let env; 
if (process.env.NODE_ENV === 'development') {
    env = require('./Config/development');
} else {
    env = require('./Config/production');
}

module.exports = merge(global, env);