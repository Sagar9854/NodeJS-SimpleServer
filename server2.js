//modules
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

//Array of mimeTypes
var mimeTypes = {
	"html" : "text/html",
	"jpeg" : "image/jpeg",
	"jpg" : "image/jpeg",
	"png" : "image/png",
	"js" : "text/javascript",
	"css" : "text/css"
};

//Create Server
http.createServer(function (req, res) {
	var uri = url.parse(req.url).pathname;
	var fileName = path.join(process.cwd(), unescape(uri));
	console.log('Loading ' + uri );
	var stats;

	try {
		stats = fs.lstatSync(fileName);
	} catch(e){
		res.writeHead(404, {'Content-type' : 'text/plain'});
		res.write("Error 404 : Page not found");
		res.end();
		return;
	}

	//check if file or directory
	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		res.writeHead(200, {'Content-type' : mimeType});

		fs.createReadStream(fileName).pipe(res);
	}
	else if(stats.isDirectory()){
		res.writeHead(302, {'location' : 'index.html'});
		res.end();
	}
	else{
		res.writeHead(500, {'Content-Type' : 'text/plain'});
		res.write('500 Internal Error');
		res.end();
	}
}).listen(5050);