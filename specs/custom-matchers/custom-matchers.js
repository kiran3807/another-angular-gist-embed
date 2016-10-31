
var customMatchers = {};

var toMatchLinesOf = function(utils) {

	function lineMapper(str) {
		var arr = str.split(','),
		map = {};
		
		arr.forEach(function(el) {
			map[el] = true;
		});
		return map;
		
	}

	function compare(actualLines, expectedObj) {
		
		actualLines = Array.prototype.map.call(actualLines,function(el) {
			
			return el.textContent;
		});

		 var lineNums = lineMapper(expectedObj.lineNums),
		 expectedLines= Array.prototype.filter.call(expectedObj.allLines,function(el, index) {
			 if(lineNums[index]) {
				 return true;
			 }
		});
		expectedLines = expectedLines.map(function(el) {
			return el.textContent;
		});
		return {
			pass : utils.equals(actualLines,expectedLines)
		}
	}

	return {
		compare : compare
	}
}

customMatchers.toMatchLinesOf = toMatchLinesOf;
