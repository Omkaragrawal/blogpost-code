var query = require('./executeQuery');

/**
    * @function
    * @description get profile of user from database.
    * @param {number} userId - Contains user Id.
    * @param {object} connection - Holds mysql connection object.
    * @param {function} errCallBack - Contains parent control callback.
    * @param {function} callback - Contains parent callback function.
*/

var getUserProfile  = function(params,connection,errCallBack,callback) {
    var sqlQuery = "SELECT * FROM ?? WHERE ??=? ORDER BY UserDeskUploadsTime DESC;";
    var data = ["UserDeskUploads"];
    if(params.userId !== undefined) {
        data.push("UserDeskUploadsUserId",params.userId);
    } else {
        data.push("UserDeskUploadsType","PUBLIC");
    }
    sqlQuery = GLOBAL.mysql.format(sqlQuery,data);
    query.executeQuery(sqlQuery,connection,function(err,rows) {
        callback(false,rows);
    });
}

module.exports.getUserProfile = getUserProfile;
