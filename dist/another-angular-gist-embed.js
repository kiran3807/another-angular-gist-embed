angular.module('another-angular-gist-embed',[]);

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


angular.module('another-angular-gist-embed').service('gistLoaderService',['$http','$q',function($http,$q){
    
    function getLineNumbers(lineRangeString){
        var lineNumbers = [], range, lineNumberSections;

        if (typeof lineRangeString === 'number') {
          lineNumbers.push(lineRangeString);
        } else {
          lineNumberSections = lineRangeString.split(',');

          for (var i = 0; i < lineNumberSections.length; i++) {
            range = lineNumberSections[i].split('-');
            if (range.length === 2) {
              for (var j = parseInt(range[0], 10); j <= range[1]; j++) {
                lineNumbers.push(j);
              }
            } else if (range.length === 1) {
              lineNumbers.push(parseInt(range[0], 10));
            }
          }
        }
        return lineNumbers;
    }
    
    function prepareGist(response,scope){
        var linkTag,
            head,
            lineNumbers,
            highlightLineNumbers,
            $responseDiv,
            returnValue,
            lines,
            loading,
            highlightLines,
            hideFooterOption,
            hideLineNumbersOption;

          hideFooterOption = scope.gistHideFooter === true;
          hideLineNumbersOption = scope.gistHideLineNumbers === true;
          lines = scope.gistLine;
          highlightLines = scope.gistHighlightLine;
          // the html payload is in the div property
          if (response && response.div) {
            // github returns /assets/embed-id.css now, but let's be sure about that
            if (response.stylesheet) {
              // github passes down html instead of a url for the stylehsheet now
              // parse off the href
              if (response.stylesheet.indexOf('<link') === 0) {
                response.stylesheet =
                  response.stylesheet
                    .replace(/\\/g,'')
                    .match(/href=\"([^\s]*)\"/)[1];
              } else if (response.stylesheet.indexOf('http') !== 0) {
                // add leading slash if missing
                if (response.stylesheet.indexOf('/') !== 0) {
                  response.stylesheet = '/' + response.stylesheet;
                }
                response.stylesheet = 'https://gist.github.com' + response.stylesheet;
              }
            }

            // add the stylesheet if it does not exist
            if (response.stylesheet && document.querySelector('link[href="' + response.stylesheet + '"]') === null) {
              linkTag = document.createElement('link');
              head = document.getElementsByTagName('head')[0];

              linkTag.type = 'text/css';
              linkTag.rel = 'stylesheet';
              linkTag.href = response.stylesheet;
              head.insertBefore(linkTag, head.firstChild);
            }

            // refernce to div
            $responseDiv = angular.element(response.div);
            // Overriding jq-lite's find as it only supports lookups by tag name. see angular.element documentation
            $responseDiv.find = function(selector){
                return angular.element(this[0].querySelectorAll(selector));
            }

            // remove id for uniqueness constraints
            $responseDiv.removeAttr('id');

            // option to highlight lines
            if (highlightLines) {
              highlightLineNumbers = getLineNumbers(highlightLines);

              // we need to set the line-data td to 100% so the highlight expands the whole line
              $responseDiv.find('td.line-data').css({
                'width': '100%'
              });

              angular.forEach($responseDiv.find('.js-file-line'),function(DOMElement,index,matchedElements){
                var element = matchedElements.eq(index);
                if (highlightLineNumbers.indexOf(index+1) !== -1){
                  element.css({
                    'background-color': 'rgb(255, 255, 204)'
                  });
                }
              });
            }

            // if user provided a line param, get the line numbers based on the criteria
            if (lines) {
              lineNumbers = getLineNumbers(lines);

              // find all trs containing code lines that don't exist in the line param
              angular.forEach($responseDiv.find('.js-file-line'), function(DOMElement,index,matchedElements){
                var element = matchedElements.eq(index);
                if (lineNumbers.indexOf(index + 1) === -1){
                  element.parent().remove();
                }
              });
            }

            // option to remove footer
            if (hideFooterOption) {
              $responseDiv.find('.gist-meta').remove();

              // present a uniformed border when footer is hidden
              $responseDiv.find('.gist-data').css('border-bottom', '0px');
              $responseDiv.find('.gist-file').css('border-bottom', '1px solid #ddd');
            }

            // option to remove
            if (hideLineNumbersOption) {
              $responseDiv.find('.js-line-number').remove();
            }
            returnValue = $responseDiv;
          }
          return returnValue; 
    }
    
    function loadGist(url,data,scope){
        return $http({
                    method : 'JSONP',
                    url : url+'?callback=JSON_CALLBACK',
                    params : data,
                    timeout : 20000,
                }).then(function(response){
                    var gistDiv = prepareGist(response.data,scope);
                    if(gistDiv){
                        return gistDiv;
                    }else{
                        return $q.reject("Failed loading gist" + url);
                    }
                },function(error){
                    return "Failed loading gist " + url + ": " + error.statusText; 
                });
    }
    return {
        loadGist : loadGist
    };
}]);
