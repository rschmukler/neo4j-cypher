var Transaction = require('./transaction.js');

module.exports = Query;

function *Query(endpoint, stmt, params) {
  var res;
  try {
    var tx = yield new Transaction(endpoint, stmt, params);
    yield tx.commit();
  } catch(e) {
    yield tx.rollback();
  }
  return res;
}

