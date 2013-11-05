/* jshint maxlen:120 */
/* global module:false */
module.exports = function(grunt) {

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),

	sass: {
		main: {
			options: {
				compass: true
			},
			files: {
				'public/css/screen.css': 'public/sass/screen.scss'
			}
		},
	},
	coffee: {
		compile: {
			files: {
				'server/app.js': 'server/app.coffee',
				'server/jira.js': 'server/jira.coffee',
				'public/js/app.js': [
					'public/coffee/classes/item.coffee',
					'public/coffee/classes/project.coffee',
					'public/coffee/app.coffee'
				]
			}
		}
	},
	watch: {
		main: {
			files: [ 'Gruntfile.js', 'public/coffee/**/*.coffee', 'public/sass/**/*.scss', 'server/**/*.coffee' ],
			tasks: 'build'
		}
	}
});

// Dependencies
grunt.loadNpmTasks( 'grunt-contrib-sass' );
grunt.loadNpmTasks( 'grunt-contrib-coffee' );
grunt.loadNpmTasks( 'grunt-contrib-watch' );

grunt.registerTask( 'build', [ 'sass', 'coffee' ] );
grunt.registerTask( 'default', [ 'build', 'watch' ] );

};
