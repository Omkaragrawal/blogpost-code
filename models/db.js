var mysql =	require("mysql");
var config = require('../config/dbConfig');
/**
 * Defines database operations.
 * @class
 */
var DB = function(){};

DB.prototype.createPool = function(){
	return mysql.createPool({
			host     : config[process.env.NODE_ENV].mysqlConfig.host,
			user     : config[process.env.NODE_ENV].mysqlConfig.user,
			password : config[process.env.NODE_ENV].mysqlConfig.password,
            database : config[process.env.NODE_ENV].mysqlConfig.database,
			connectionLimit : config[process.env.NODE_ENV].mysqlConfig.connectionLimit
		});
}

/**
 * Establishes mysql connection and returns the connection object.
 * @function
 * @param {object} pool - Mysql pool object.
 * @param {function} callback - Callback.
 */
DB.prototype.getConnection = function(pool,callback){
	pool.getConnection(function(err, connection) {
		if(err) {
			//logging here
			GLOBAL.winston.log(err);
			callback(true);
			return;
		}
		connection.on('error', function(err) {
			if(err.code === "PROTOCOL_CONNECTION_LOST") {
				connection.destroy();
			} else {
				connection.release();
			}
			GLOBAL.winston.log(err);
			callback(true);
			return;
		});
		callback(null,connection);
	});
}

/**
 * Establishes mysql connection, begins transaction and returns the transactio connection object.
 * @function
 * @param {object} pool - Mysql pool object.
 * @param {function} callback - Callback.
 */
DB.prototype.createTransaction = function(pool,callback) {
	var self = this;
	self.getConnection(pool,function(err,connection){
		if(err) {
			//logging here
			GLOBAL.winston.log(err);
			callback(true);
			return;
		}
		connection.beginTransaction(function(err) {
			if(err){
				GLOBAL.winston.log(err);
				callback(true);
				return;
			}
			callback(null,connection)
		});
	});
}

module.exports = new DB();
