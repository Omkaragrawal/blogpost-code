var executeQuery = function(sqlQuery,connection,errCallBack,callback) {
    connection.query(sqlQuery,function(err,rows) {
        if(err) {
            return errCallBack(true,err.code);
        }
        callback(false,rows);
    });
}

module.exports.executeQuery = executeQuery;
