module.exports = function(grunt){
	var srcPath = './src/';
	var distPath = './dist/';
	grunt.initConfig({
		concat : {
			origin : {
				src : [
					srcPath + 'another-angular-gist-embed.js',
					srcPath + 'directives/**/*.js',
					srcPath + 'services/**/*.js'
				],
				dest : distPath + 'another-angular-gist-embed.js'
			}
		},

		watch: {
			options: {
				livereload: true
			},
			files: [
				'Gruntfile.js',
				'src/**/*',
				'specs/**/*'
			],
			tasks: ['default']
		},

		karma: {
			unit: {
				configFile: 'karma-conf.js',
				singleRun: true,
				browsers: ['PhantomJS']
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('test', ['default', 'watch']);
	grunt.registerTask('default', ['concat','karma']);
}
