var spawn = require('child_process').spawn
var express = require('express')
var app = express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var port = process.env.PORT || 3000


app.get("/", function(req, res, next){
	res.send(`
		<script src="/socket.io/socket.io.js"></script>
		<script>

			var socket = io()
			socket.on("message", function(message) {
				document.write(JSON.stringify(message) + "<br/>")
			})
		</script>


	`)
})

server.listen(port, function() {
  console.log('Server listening at port %d', port);
})

function streamProcessToSocket (args, io) {
	console.log('starting', args.join(' '))
	var p = spawn('ping', ['google.com'])

	function emit(type) {
		return function(data) {
			io.emit('message',{
				args: args,
				data: data.toString(),
				type: type,
			})
		}
	}
	p.stdout.on('data', emit('stdout'))
	p.stderr.on('data', emit('stderr'))

}

streamProcessToSocket(["ping", "google.com"], io)
streamProcessToSocket(["ping", "seznam.cz"], io)
