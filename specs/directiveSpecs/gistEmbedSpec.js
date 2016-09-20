describe("gistEmbed directive : ",function(){

	beforeEach(module('another-angular-gist-embed'));
	
	beforeEach( inject(function($rootScope, $compile, $httpBackend){
		rootScope = $rootScope;
		httpBackend = $httpBackend;
		scope = $rootScope.$new();
		scope.gistId = '5457619';
		scope.gistFile = 'example-1.js';
		var template = '<gist-embed data-gist-id="gistId" data-gist-file="gistFile"></gist-embed>';
		var link = $compile(template);
		$template = link(scope);

		//fixture.setBase('specs/fixtures');
		//gist = fixture.load('gistDataFixture.json');
	} ));

	it("The loading message must be displayed at the start",function(){
		
		/*httpBackend.expect('JSONP','https://gist.github.com/'+scope.gistId+'.json?callback=JSON_CALLBACK').respond(gist);*/
//		httpBackend.flush();
		var text = 'Loading gist https://gist.github.com/' + scope.gistId + '.json, file: example-1.js...';
		var divtext = $template.text();
		console.log(divtext);
		expect(text).toBe(divtext);
		//expect(httpBackend.flush).not.toThrow();
	});
});
