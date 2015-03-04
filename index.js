var Query = require('./lib/query.js');
var Tx = require('./lib/transaction.js');

module.exports = function(endpoint) {
  return {
    query: Query.bind(Query, endpoint),
    begin: function(stmt, args) { return new Tx(endpoint, stmt, args); }
  };
};
