fs = require 'fs'
path = require 'path'

path_to_projects = path.join __dirname, 'projects.json'

projects = []
if fs.existsSync path_to_projects
	projects = fs.readFileSync(path_to_projects, 'utf-8')
else
	console.log "not found: #{path_to_projects}"

jira = require './jira'
lib_static = require 'node-static'

server = new lib_static.Server 'public'
http = require 'http'
app = http.createServer (req, res) ->
	server.serve req, res
app.listen 8000

io = (require 'socket.io').listen app
io.set 'log level', 0

io.sockets.on 'connection', (socket) ->
	console.log 'connected client: '

	socket.emit 'load', projects

	socket.on 'query', (query) ->
		jira.search query, (err, result) ->
			if err
				socket.emit 'error', err
			else
				socket.emit 'results', result

	socket.on 'save', (data) ->
		if typeof data == "string"
			data = JSON.parse(data)

		if data?.length > 0
			projects = JSON.stringify(data)
			socket.broadcast.emit 'load', projects
		else
			socket.emit 'error', 'no data to save'

	socket.on 'disconnect', () ->
		console.log 'disconnected client'
