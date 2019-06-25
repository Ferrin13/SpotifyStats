const merge = require('lodash/merge');
const global = require('./config/global');

let env; 
if (process.env.NODE_ENV === 'development') {
    env = require('./config/development');
} else {
    env = require('./config/production');
}

module.exports = merge(global, env);