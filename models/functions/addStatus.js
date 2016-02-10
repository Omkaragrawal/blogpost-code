var query = require('./executeQuery');

/**
    * @function
    * @description Add new photo status in database..
    * @param {object} params - Contains email and password.
    * @param {object} connection - Holds mysql connection object.
    * @param {function} errCallBack - Contains parent control callback.
    * @param {function} callback - Contains parent callback function.
*/

var addStatus  = function(params,connection,errCallBack,callback) {
    var sqlQuery = "INSERT into ?? (??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
    var data = ["UserDeskUploads"
      ,"UserDeskUploadsUserId","UserDeskUploadsPath"
      ,"UserDeskUploadsSize","UserDeskUploadsFileName"
      ,"UserDeskUploadsTitle","UserDeskUploadsType"
      ,params.userId,params.path,params.fileSize
      ,params.fileName,params.fileTitle,params.shareType];
    sqlQuery = GLOBAL.mysql.format(sqlQuery,data);
    query.executeQuery(sqlQuery,connection,function(err,rows) {
        callback(false,rows.insertId);
    });
}

module.exports.addStatus = addStatus;
