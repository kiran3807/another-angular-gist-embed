describe("gistEmbed directive : ",function(){

	beforeEach(module('another-angular-gist-embed',function($provide){
		$provide.service("gistLoaderService",['$q',function($q){
			var defer = $q.defer();
			this.loadGist = function(){
				defer.resolve('<div id="mockGist">This is fake gist</div>');
				return defer.promise;
			}
		}]);
	}));
	
	beforeEach( inject(function($rootScope, $compile, $httpBackend){
		rootScope = $rootScope;
		httpBackend = $httpBackend;
		scope = $rootScope.$new();
		compile = $compile;
		//fixture.setBase('specs/fixtures');
		//gist = fixture.load('gistDataFixture.json');
	} ));

	it("The loading message must be displayed at the start",function(){
		
		/*httpBackend.expect('JSONP','https://gist.github.com/'+scope.gistId+'.json?callback=JSON_CALLBACK').respond(gist);*/
//		httpBackend.flush();
		var template = '<gist-embed data-gist-id="gistId" data-gist-file="gistFile"></gist-embed>',
		$template,text,divtext;
		
		scope.gistId = 7865;
		scope.gistFile = "example-file";
		$template = compile(template)(scope);
		text = 'Loading gist https://gist.github.com/' + scope.gistId + '.json, file: '+ scope.gistFile + '...';
		divtext = $template.text();
		expect(text).toBe(divtext);
		//expect(httpBackend.flush).not.toThrow();
	});

	it("if spinner is enabled, then spinner must be shown, despite show loading text being set to true",function(){
		var template = '<gist-embed data-gist-id="gistId" data-gist-show-spinner="enable" data-gist-show-loading="true"></gist-embed>',
		$template,nativeElement,flag;
		
		scope.gistId = 7865;
		scope.enable = true;
		$template = compile(template)(scope);

		nativeElement = $template[0];
		flag = nativeElement.querySelectorAll("img").length;
		expect(flag).toBeGreaterThan(0);

	});

	it("if loading text is disabled it should not be shown",function(){
		var template = '<gist-embed data-gist-show-loading="false"></ gist-embed>',
		$template;

		$template = compile(template)(scope);
		expect($template.text()).toBe('');
		
	});

	it("should display the gist",function(){
		var template = '<gist-embed data-gist-id="gistId"></gist-embed>',
		$template,text,divtext;
		
		scope.gistId = 7865;
		$template = compile(template)(scope);
		text = 'This is fake gist';
		/* Propagate promise resolution to 'then' functions using $apply(). see https://docs.angularjs.org/api/ng/service/$q */
		rootScope.$apply();
		divtext = $template.text();
		expect(text).toBe(divtext);
		
	})
});
