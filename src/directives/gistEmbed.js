angular.module('another-angular-gist-embed').directive('gistEmbed',['gistLoaderService',function(gistLoaderService){

    
    function link(scope,elem){
        var id,
        url,
        showLoading,
        showSpinner,
        file,
        data = {};

      // make block level so loading text shows properly
      elem.css('display', 'block');
      id = scope.gistId || '';
      showSpinner = scope.gistShowSpinner === true;
      file = scope.gistFile;
      if (file) {
        data.file = file;
      }
      if (showSpinner) {
        showLoading = false;
      } else {
        showLoading = scope.gistShowLoading !== undefined ?
          scope.gistShowLoading : true;
      }
      // if the id doesn't exist, then ignore the code block
      if (!id) {
        return false;
      }
      
      url = 'https://gist.github.com/' + id + '.json';
      loading = 'Loading gist ' + url + (data.file ? ', file: ' + data.file : '') + '...';

      // loading
      if (showLoading)  {
        elem.html(loading);
      }
      
      if (showSpinner) {
        elem.html('<img style="display:block;margin-left:auto;margin-right:auto"  alt="' + loading + '" src="https://assets-cdn.github.com/images/spinners/octocat-spinner-32.gif">');
      }
      gistLoaderService.loadGist(url,data,scope).then(function(gistDiv){
        elem.html('').append(gistDiv);
      },function(errorText){
        elem.html(errorText)
      }).finally(function(){
        scope.afterLoad();
      });
    }

    return {
        restrict : 'EA',
        scope : {
            afterLoad : '=?',
            gistHideFooter : '=?',
            gistHideLineNumbers : '=?',
            gistLine : '=?',
            gistHighlightLine : '=?',
            gistId : '=',
            gistShowSpinner : '=?',
            gistFile : '=?' ,
            gistShowLoading : '=?'
        },
        link : link
    };
}]);
