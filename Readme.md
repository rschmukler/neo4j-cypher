Simple promise based API around cypher

## Usage

```
var db = require('neo4j-cypher')('http://localhost:7474');
db.query('MATCH (p:Person) return p').then(function(results) {
  console.log(results);
});

db.begin().then(function() {
  tx.query([
    'CREATE (r:Person{name: {ryan}})',
    'CREATE (b:Person{name: {bob}})',
    'CREATE (r)-[l:KNOWS]->(b) return r,l,b'
  ], { ryan: 'Ryan', bob: 'Bob' }).then(function() {
    tx.commit();
  });
});
```
