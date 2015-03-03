var co = require('co');

var db = require('./index.js')('localhost:7474');

co(function*() {
  var tx = yield db.begin();
  yield tx.query([
    'CREATE (r:Person{name: {ryan}})',
    'CREATE (b:Person{name: {bob}})',
    'CREATE (r)-[l:KNOWS]->(b) return r,l,b'
  ], { ryan: 'Ryan', bob: 'Bob' });
  yield tx.commit();
}).then(function() {
  console.log("It worked");
}, function(err) {
  console.log(err);
  console.log(err.stack);
});
