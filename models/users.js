"use strict";
var async = require('async');
var db = require('./db');
var checkUser = require('./functions/login');
var addUser = require('./functions/register');
var profile = require('./functions/profile');

/**
    * @class
    * @description Handles all user related database operation.
*/

class Users {

    /**
        * @function
        * @description Register new user in system.
        * @param {object} param - contains user name, password and login name.
    */

    function addNewUser(params,callback) {
        db.getConnection(GLOBAL.mysqlPool,function(err,connection) {
            if(err) {
                return callback(true,"Error creating database connection");
            }
            async.waterfall([
                function(callback) {
                    checkUser.login(params,connection,callback,function(err,loginResponse) {
                        if(err) {
                            return callback(null);
                        }
                        callback(true,"User already exists");
                    });
                },
                function(callback) {
                    addUser.register(params,connection,callback,function(err,registerResponse) {
                        callback(null,registerResponse);
                    });
                }
            ],function(err,data) {
                callback(false,data);
            });
        });
    }

    /**
        * @function
        * @description Fetch user profile from system.
        * @param {number} userId - Holds user id.
    */

    function getUserProfile(userId,callback) {
        profile.getUserProfile(userId,connection,callback,function(err,profileData) {
            callback(false,profileData);
        });
    }

    /**
        * @function
        * @description Check user login in system.
        * @param {object} params - Holds user name and password.
    */

    function login(params,callback) {
        checkUser.login(params,connection,callback,function(err,loginResponse) {
            if(err) {
                return callback(true,loginResponse);
            }
            callback(false,loginResponse);
        });
    }

}
