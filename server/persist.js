/* global module, require, __dirname */
var fs, path, path_to_projects;
fs = require('fs');
path = require('path');
path_to_projects = path.join(__dirname, 'projects.json');

module.exports = {
	load: function() {
		var projects;
		if (fs.existsSync(path_to_projects)) {
			projects = fs.readFileSync(path_to_projects, 'utf-8');
		}
		return projects || "[]";
	},
	save: function(json, socket) {
		json = json || "[]";
		var projects = JSON.parse(json);
		if (projects.length > 0) {
			fs.writeFile(path_to_projects, json);
			socket.broadcast.emit('load', json);
			return true;
		}
		socket.emit('error', 'no data to save');
	}
};
