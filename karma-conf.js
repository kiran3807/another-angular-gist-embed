module.exports = function(config){
	config.set({
		basePath: '.',

		frameworks: ['jasmine','fixture'],

		plugins: [
			'karma-jasmine',
			'karma-phantomjs-launcher',
			'karma-fixture',
			'karma-html2js-preprocessor',
			'karma-json-fixtures-preprocessor'
		],

		preprocessors: {
			'**/*.html'   : ['html2js'],
			'**/*.json'   : ['json_fixtures']
		},

		jsonFixturesPreprocessor: {
			variableName: '__json__'
		},
		
		files: [
			'specs/custom-matchers/custom-matchers.js',
			'node_modules/angular/angular.js',
			'node_modules/angular-mocks/angular-mocks.js',
			'dist/another-angular-gist-embed.js',
			'specs/**/*.js',
			// fixtures
			'specs/fixtures/*.json'
		],
		reporters: ['progress'],
		colors: true,
		browsers: ['PhantomJS'],
		captureTimeout: 60000,
		singleRun: false	
	});
}

/*
 * Please make sure the entry for localhost in /etc/hosts file
 * is set to 127.0.0.1. see this :
 * https://github.com/karma-runner/karma-phantomjs-launcher/issues/84
 */
