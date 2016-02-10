var express         =	  	require("express");
var redis           =	  	require("redis");
var session         =	  	require('express-session');
var redisStore      =	  	require('connect-redis')(session);
var bodyParser      =	  	require('body-parser');
var cookieParser    =	  	require('cookie-parser');
var path            =	  	require("path");
var client          =	  	redis.createClient();
var app             =	  	express();
var http			=   	require('http').Server(app);
var io				=   	require("socket.io")(http);
var router          =		express.Router();
var db				=		require('./models/db');

app.set('views', path.join(__dirname,'../','views'));
app.use('/public',express.static(path.join(__dirname,'../','public')));
app.use(express.static(path.join(__dirname,'../','Lib')));
app.use(express.static(path.join(__dirname,'../','client/public')));
app.use(express.static(path.join(__dirname,'../','client')));
app.engine('html', require('ejs').renderFile);

app.use(session({
		secret: 'ssshhhhh',
		store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  260}),
		saveUninitialized: false,
		resave: false
}));

app.use(cookieParser("secretSign#143_!223"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

GLOBAL.mysql = require('mysql');
GLOBAL.mysqlPool = db.createPool();

var route 	=   require('./routes')(app,router,io);

io.on('connection',function(socket) {
	socket.on("status added",function(fileName){
		io.emit('update feed',fileName);
	});
});

http.listen(3000,function(){
	console.log("I am running at 3000");
});
