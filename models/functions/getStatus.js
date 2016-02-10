var query = require('./executeQuery');

/**
    * @function
    * @description get photo status from database..
    * @param {object} params - Contains userId if available..
    * @param {object} connection - Holds mysql connection object.
    * @param {function} errCallBack - Contains parent control callback.
    * @param {function} callback - Contains parent callback function.
*/

var getStatus  = function(params,connection,errCallBack,callback) {
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

module.exports.getStatus = getStatus;
