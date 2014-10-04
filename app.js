var express = require('express');

var reloadComm = require('./reload-comm');
reloadComm.func();
 
var app = express();
// app.use(express.logger());

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/app');
  //app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/app'));
  app.use(app.router);
  app.engine('html', require('ejs').renderFile);
});

app.get('/', function(request, response) {
  response.render('index.html')
});

var port = process.env.PORT || 5000;
var server = app.listen(port, function() {
  console.log("Listening on " + port);
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	console.log('user connected');
	socket.on('disconnect', function() {
	    console.log('user disconnected');
	});
	socket.on('chat_message', function(msg){
	    console.log('message: ' + msg);
	    io.emit('chat_message', msg);
	});
    // socket.emit('news', { hello: 'world' });
    // socket.on('my other event', function (data) {
    //     console.log(data);
    // });
});