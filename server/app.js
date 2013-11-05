/* global require, console */
var app, http, io, jira, lib_static, persist, projects_cache, server;

jira = require('./jira');
persist = require('./persist');
lib_static = require('node-static');
projects_cache = persist.load();
server = new lib_static.Server('public');
http = require('http');

app = http.createServer(function(req, res) {
	server.serve(req, res);
});

app.listen(80);
io = require('socket.io').listen(app);
io.set('log level', 0);

io.sockets.on('connection', function(socket) {
	socket.emit('load', projects_cache);
	socket.on('query', function(query) {
		jira.search(query, function(err, results) {
			if (err) {
				return socket.emit('error', err);
			}
			socket.emit('results', results);
		});
	});
	socket.on('save', function(projects_json) {
		if (persist.save(projects_json, socket)) {
			projects_cache = projects_json;
		}
	});
	socket.on('disconnect', function() {
		console.log('disconnected client');
	});
});
