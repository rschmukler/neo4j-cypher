var Transaction = require('./transaction.js');

module.exports = Query;

function *Query(endpoint, stmt, params) {
  var tx = yield new Transaction(endpoint);
  var res;
  try {
    res = yield tx.query(stmt, params);
    yield tx.commit();
  } catch(e) {
    yield tx.rollback();
  }
  return res;
}

