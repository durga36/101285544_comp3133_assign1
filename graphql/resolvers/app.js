var authResolver = require('./auth');
var eventsResolver = require('./events');
var bookingResolver = require('./booking');

var rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver
};

module.exports = rootResolver;