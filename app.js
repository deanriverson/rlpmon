var express = require('express');

var reloadComm = require('./reload-comm');
reloadComm.init(function(commPort) {
	console.log('Found Re:load Pro on comm', commPort);
	reloadComm.startReading(1000, function(i, v) {
		io && io.emit('vit', v, i, 40);
	});
});
 
var app = express();
// app.use(express.logger());

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/app');
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
	console.log('user connected, sending commPort', reloadComm.getCommPort());

	socket.emit('commPort', reloadComm.getCommPort());
	socket.emit('setCurrentMillis', reloadComm.getRequestedCurrent());

	socket.on('disconnect', function() {
	    console.log('user disconnected');
	});

	socket.on('setCurrentMillis', function(currentMillis){
	    reloadComm.setCurrentMillis(currentMillis, function(milliAmps, err, results) {
		    console.log('setCurrentMillis', milliAmps, err, results);
	    	io.emit('setCurrentMillis', milliAmps);
	    });
	});
});