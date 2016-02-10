var query = require('./executeQuery');

/**
    * @function
    * @description Perform login operation across our database.
    * @param {object} params - Contains email and password.
    * @param {object} connection - Holds mysql connection object.
    * @param {function} errCallBack - Contains parent control callback.
    * @param {function} callback - Contains parent callback function.
*/

var login  = function(params,connection,errCallBack,callback) {
    var sqlQuery = "SELECT * FROM ?? INNER JOIN ?? ON UserLogin.idUserLogin = UserProfile.idUserProfile WHERE ?? = ? AND ?? = ?";
    var data = ["UserLogin","UserProfile","UserLoginName",params.user_email,"UserLoginPassword",params.user_password];
    sqlQuery = GLOBAL.mysql.format(sqlQuery,data);
    query.executeQuery(sqlQuery,connection,function(err,rows){
        if(rows.length === 0 || rows.length > 0) {
            return callback(true,"Invalid user");
        }
        callback(false,"Successfull login");
    });
}

module.exports.login = login;
