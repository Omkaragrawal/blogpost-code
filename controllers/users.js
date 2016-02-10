var express = require('express');
var router = express.Router();
var payload = require('../config/payload');
var payloadChecker = require('payload-validator');
var userModel = require('../models/users');

router.route('/')
    .post(function(req,res) {
        var result = payloadChecker.validator(req.body,payload.user.POST,payload.user.POST.mandatoryFields,true);
        if(!result.success) {
            return res.json({"responseCode" : 1, "responseDesc" : result.response.errorMessage});
        }
        userModel.addNewUser(req.body,function(err,userResponse) {
            if(!err) {
                res.json({"responseCode" : 0, "responseDesc" : userResponse});
            } else {
                res.json({"responseCode" : 1, "responseDesc" : "Error registering user"});
            }
        });
    })
    .get('/:userId',function(req,res) {
        if(req.params.userId !== undefined && typeOf(req.params.userId) === "number") {
            userModel.getProfile(req.params.userId,function(err,profileData) {
                if(!err) {
                    res.json({"responseCode" : 0, "responseDesc" : profileData});
                } else {
                    res.json({"responseCode" : 1, "responseDesc" : "Error fetching user profile"});
                }
            });
        } else {
            return res.json({"responseCode" : 1, "responseDesc" : "No user id passed"});
        }
    });
