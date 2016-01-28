var handle_database =   require("./db");
var multer  =   require('multer');
var ExpressRouter = function(app,router,io) {
  var self = this;
  self.done = false;
  router.get('/',function(req,res){
    if(req.session.key) {
      res.render("home.html",{ email : req.session.key["user_name"]});
    } else {
      res.render('index.html');
    }
  });

  router.post('/login',function(req,res){
    handle_database(req,"login",function(response){
  		if(response === null) {
  			res.json({"error" : "true","message" : "Database error occured"});
  		} else {
  			if(!response) {
  				res.json({"error" : "true","message" : "Login failed ! Please register"});
  			} else {
  				req.session.key = {
            "user_id" : response.idUserLogin,
            "user_name" : response.UserProfileName
          };
  				res.json({"error" : false,"message" : "Login success."});
  			}
  		}
  	});
  });

  router.get('/home',function(req,res){
  	if(req.session.key) {
  		res.render("home.html",{ email : req.session.key["user_name"]});
  	} else {
  		res.redirect("/");
  	}
  });

  router.get("/fetchStatus",function(req,res){
    //if(req.session.key) {
      handle_database(req,"getStatus",function(response){
        if(!response) {
          res.json({"error" : true, "message" : "There is no status to show."});
        } else {
          res.json({"error" : false, "message" : response});
        }
      });
    //} else {
    //  res.json({"error" : true, "message" : "Please login first."});
    //}
  });

  router.post("/addStatus"
    ,[
      multer({dest : 'public/',
        rename: function (fieldname, filename) {
         return filename+Date.now();
        },
        onFileUploadStart: function (file) {
         console.log(file.originalname + ' is starting ...')
        },
        onFileUploadComplete: function (file) {
         console.log(file.fieldname + ' uploaded to  ' + file.path)
         self.done=true;
         self.fileInfo = {
           "path" : file.path,
           "size" : file.size,
           "name" : file.name
         }
        }
      })
      ,function(req,res){
        if(req.session.key && self.done) {
          req.body["path"] = self.fileInfo.path;
          req.body["fileSize"] = self.fileInfo.size;
          req.body["fileName"] = self.fileInfo.name;
          console.log(req.body);
          handle_database(req,"addStatus",function(response){
            if(!response) {
              res.json({"error" : false, "message" : "Status is added.", "file" : self.fileInfo.path});
            } else {
              res.json({"error" : false, "message" : "Error while adding Status"});
            }
          });
        } else {
          res.json({"error" : true, "message" : "Please login first."});
        }
  }]);

  router.post("/register",function(req,res){
    handle_database(req,"checkEmail",function(response){
        if(response === null) {
          res.json({"error" : true, "message" : "This email is already present"});
        } else {
          handle_database(req,"register",function(response){
            if(response === null) {
              res.json({"error" : true , "message" : "Error while adding user."});
            } else {
              handle_database(req,"updateName",function(response){
                if(response === null) {
                  res.json({"error" : true , "message" : "Error while adding user."});
                } else {
                  res.json({"error" : false, "message" : "Registered successfully."});
                }
              });
            }
          });
        }
      });
  });

  router.get('/profile',function(req,res){
    if(req.session.key) {
  		res.render("profile.html",{ email : req.session.key["user_name"]});
  	} else {
  		res.redirect("/");
  	}
  });

  router.get('/logout',function(req,res){
  	if(req.session.key) {
      req.session.destroy(function(){
        res.redirect('/');
      });
  	} else {
  		res.redirect('/');
  	}
  });

  app.use('/',router);
}

module.exports = ExpressRouter;
