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
				'css/screen.css': 'sass/screen.scss'
			}
		},
	},
	coffee: {
		compile: {
			files: {
				'js/app.js': ['coffee/*.coffee']
			}
		}
	},
	watch: {
		main: {
			files: [ 'Gruntfile.js', 'coffee/**/*.coffee', 'sass/**/*.scss' ],
			tasks: 'build'
		}
	},

});

// Dependencies
grunt.loadNpmTasks( 'grunt-contrib-sass' );
grunt.loadNpmTasks( 'grunt-contrib-coffee' );
grunt.loadNpmTasks( 'grunt-contrib-watch' );

grunt.registerTask( 'build', [ 'sass', 'coffee' ] );
grunt.registerTask( 'default', [ 'build', 'watch' ] );

};
