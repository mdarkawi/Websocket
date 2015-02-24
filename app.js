var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand on client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !  '+__dirname);

    //socket.broadcast.emit('message','new user');
    //I emit a push to the application
    

    socket.on('newUser',function(pseudo){
		socket.user = pseudo;
		console.log('>>'+socket.user);
		socket.emit('message','hello '+socket.user);
	});

    var jsonPath = __dirname + '/_comments.json';


    fs.watch(  jsonPath , function(curr, prev){

        // console.log('curr: '+curr);
        // console.log('prev: '+prev);

        fs.readFile( jsonPath, function(err, data){            

            console.log('0 '+data);
            // var json = data;
            // console.log('1 '+json );
            // console.log('err: '+JSON.stringify( json));
            // console.log('data: '+JSON.stringify(json));
            
            // console.log('read file');

            if(err){
                console.log('erroooor')
                throw err
            }
            console.log('no erroooor');

            socket.emit('notification', JSON.stringify(data));


        });

    });


});




server.listen(8080);