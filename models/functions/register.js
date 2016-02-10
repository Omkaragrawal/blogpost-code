var query = require('./executeQuery');
var async = require('async');

/**
    * @function
    * @description Register new user into our image sharing application.
    * @param {object} params - Contains user email, user name and user password.
    * @param {object} connection - Holds mysql connection object.
    * @param {function} errCallBack - Parent control callback.
    * @param {function} callback - Callback function.
*/

var register  = function(params,connection,errCallBack,callback) {
    async.waterfall([
        /**
        * @function
        * @description Add new user into user login table.
        */
        function(callback) {
            var sqlQuery = "INSERT into ?? (??,??) VALUES (?,?)";
            var data = ["UserLogin","UserLoginName","UserLoginPassword",params.userLoginName,params.userPassword];
            sqlQuery = GLOBAL.mysql.format(sqlQuery,data);
            query.executeQuery(sqlQuery,connection,errCallBack,function(err,rows) {
                console.log(rows);
                callback(null,rows.insertId);
            });
        },
        /**
        * @function
        * @description Create new profile of user into database.
        * @param {integer} userId - User id from login table.
        */
        function(userId,callback) {
            var sqlQuery = "INSERT into ?? (??,??,??) VALUES (?,?,?)";
            var data = ["UserProfile","idUserProfile","UserProfileName","UserProfileAccountStatus",userId,params.userName,"ACTIVE"];
            sqlQuery = GLOBAL.mysql.format(sqlQuery,data);
            query.executeQuery(sqlQuery,connection,errCallBack,function(err,rows) {
                callback(null,"User is registered successfully");
            });
        }
    ],function(err,data) {
        callback(false,data);
    });
}

module.exports.register = register;
