var Query = require('./lib/query.js');
var Tx = require('./lib/transaction.js');

module.exports = function(endpoint) {
  return {
    query: Query.bind(Query, endpoint),
    begin: function() { return new Tx(endpoint); }
  };
};
