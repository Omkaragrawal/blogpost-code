var express = require('express');
var router = express.Router();


router.get('/',function(req,res){
  if(req.session.key) {
    res.render("home.html",{ email : req.session.key["user_name"]});
  } else {
    res.render('index.html');
  }
});

router.use('/users',require('./users'));
router.use('/status',require('./status'));

router.use('*',function(req,res){
    res.status(404).send('404');
});

module.exports = router;
