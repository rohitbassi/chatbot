const pg = require('pg');
const config = require('./config.js');

// create a config to configure both pooling behavior 
// and client options 
// note: all config is optional and the environment variables 
// will be read if the config is not present 
var dbConfig = {
 user: config.PGUSER, //env var: PGUSER 
  database: config.PGDATABASE, //env var: PGDATABASE 
password: config.PGPASSWORD, //env var: PGPASSWORD 
  host: config.PGHOST, // Server hosting the postgres database 
  port: config.PGPORT, //env var: PGPORT 
  max: config.MAX_PG_CONNECTION, // max number of clients in the pool 
  idleTimeoutMillis: config.IDLE_TIMEOUT_MILLIS, // how long a client is allowed to remain idle before being closed 
};

//this initializes a connection pool 
//it will keep idle connections open for 30 seconds 
//and set a limit of maximum 10 idle clients 
const pool = new pg.Pool(dbConfig);

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool 
  // the pool itself will emit an error event with both the error and 
  // the client which emitted the original error 
  // this is a rare occurrence but can happen if there is a network partition 
  // between your application and the database, the database restarts, etc. 
  // and so you might want to handle it and at least log it out 
  console.error('idle client error', err.message, err.stack);
});

//export the query method for passing queries to the pool 
module.exports.query = function (text, values, callback) {
  return pool.query(text, values, callback);
};

// the pool also supports checking out a client for 
// multiple operations, such as a transaction 
module.exports.connect = function (callback) {
  return pool.connect(callback);
};

// const pg = require('pg');
// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

// const client = new pg.Client(connectionString);
// client.connect();
// const query = client.query(
//   'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
// query.on('end', () => { client.end(); });