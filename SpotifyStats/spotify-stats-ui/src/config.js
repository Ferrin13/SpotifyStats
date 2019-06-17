const merge = require('lodash/merge');
const global = require('./Config/global');

let env; // let doesn't seem to work here
if (process.env.NODE_ENV === 'development') {
    env = require('./Config/development');
} else {
    env = require('./Config/development');
}

module.exports = merge(global, env);