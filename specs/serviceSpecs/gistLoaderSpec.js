//TODO write tests for highlight functionality

describe('gistEmbedService specs : ',function(){

	beforeEach(function() {
		jasmine.addMatchers(customMatchers);
	});
	
	beforeEach(module('another-angular-gist-embed',function($provide){
		
	} ));

	beforeEach(inject(function($rootScope, gistLoaderService, $httpBackend) {
		service = gistLoaderService;
		httpBackend = $httpBackend;
		rootScope = $rootScope;
		fixture.setBase('specs/fixtures');
		dataFixture = fixture.load('gistDataFixture.json');
		multipleFileFixture = fixture.load('multipleFileFixture.json');
		multipleLineFixture = fixture.load('multipleLineFixture.json');
	}));

	it('return the gist on valid gist id',function() {
		
		var id = '5457595',
		url = 'https://gist.github.com/' + id + '.json',
		data = {},
		scope = {},
		test = false;
		httpBackend.when('JSONP',url+'?callback=JSON_CALLBACK').respond(dataFixture);
		service.loadGist(url,data,scope).then(function(gistData) {
			test = gistData.hasClass('gist');
			expect(test).toBe(true);
		});
		httpBackend.flush();
		rootScope.$apply();
	});

	it('remove footer when option is passed in scope',function() {
		
		var id = '5457595',
		url = 'https://gist.github.com/' + id + '.json',
		data = {},
		scope = {
			gistHideFooter : 'true'
		},
		test = false;
		httpBackend.when('JSONP',url+'?callback=JSON_CALLBACK').respond(dataFixture);
		service.loadGist(url,data,scope).then(function(gistData) {
			test = gistData.hasClass('gist-meta');
			expect(test).toBe(false);  
		});
		httpBackend.flush();
		rootScope.$apply();
	});

	it('remove line numbers when option is set in the scope',function() {
		
		var id = '5457595',
		url = 'https://gist.github.com/' + id + '.json',
		data = {},
		scope = {
			gistHideLineNumbers : 'true'
		},
		test = false;
		httpBackend.when('JSONP',url+'?callback=JSON_CALLBACK').respond(dataFixture);
		service.loadGist(url,data,scope).then(function(gistData) {
			test = gistData.hasClass('js-line-number');
			expect(test).toBe(false);
		});
		httpBackend.flush();
		rootScope.$apply();
	});

	it('Load gists with multiple files',function() {
		
		var id = '5457635',
		url = 'https://gist.github.com/' + id + '.json',
		data = {},
		scope = {
			gistHideFooter : 'true'
		},
		number_of_files = 0;
		httpBackend.when('JSONP',url+'?callback=JSON_CALLBACK').respond(multipleFileFixture);
		service.loadGist(url,data,scope).then(function(gistData) {
			/*
			   find has been monkey-patched by gistLoaderService
			   to support lookup via CSS selectors.
			   See angular.element docs 
			*/
			number_of_files = gistData.find('.gist-file').length;
			expect(number_of_files).toBe(3);
		});
		httpBackend.flush();
		rootScope.$apply();
	});

	it('Load gist with single line option enabled',function() {
		
		var id = 'e85a1d560986dc5c3fa62d8831ed514d',
		url = 'https://gist.github.com/' + id + '.json',
		data = {},
		scope = {
			gistLine : '1'
		},
		gist = angular.element(multipleLineFixture.div),
		allLines = angular.element(gist[0].querySelectorAll('.js-file-line')),
		actualLines;

		httpBackend.when('JSONP',url+'?callback=JSON_CALLBACK').respond(multipleLineFixture);
		service.loadGist(url,data,scope).then(function(gistData) {
			actualLines = gistData.find('.js-file-line');
			var expectedLines = {
				'allLines' : allLines,
				'lineNums' : "0"
			}
			expect(actualLines).toMatchLinesOf(expectedLines);
		});
		httpBackend.flush();
		rootScope.$apply();
	});

	it('load gist with multiple lines option enabled', function() {
		var id = 'e85a1d560986dc5c3fa62d8831ed514d',
		url = 'https://gist.github.com/' + id + '.json',
		data = {},
		scope = {
			gistLine : '1-3,5'
		},
		gist = angular.element(multipleLineFixture.div),
		allLines = angular.element(gist[0].querySelectorAll('.js-file-line')),
		actualLines;

		httpBackend.when('JSONP',url+'?callback=JSON_CALLBACK').respond(multipleLineFixture);
		service.loadGist(url,data,scope).then(function(gistData) {
			actualLines = gistData.find('.js-file-line');
			var expectedLines = {
				'allLines' : allLines,
				'lineNums' : "0,1,2,4"
			}
			expect(actualLines).toMatchLinesOf(expectedLines);
		});
		httpBackend.flush();
		rootScope.$apply();
	});

});


