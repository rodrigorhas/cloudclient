angular
.module('App')
.factory("$helper", function ($window, $rootScope, $timeout, $http, $mdToast, $location) {

	var $helper = {
		toast: function (text, time) {
			$mdToast.show(
				$mdToast.simple()
				.textContent(text)
				.position("top right")
				.hideDelay(time || 4000)
				);
		},

		closeToast: function () {
			return $mdToast.hide();
		},

		QueryString: function () {

			return function (_url) {
	            // private
	            var url   = _url,
	            table = {};

	            function buildTable(){
	            	var qr = getQuerystring();
	            	if(qr.indexOf("&") > 1) {
	            		return qr.split('&').filter(validatePair).map(parsePair);
	            	}

	            	console.log([qr]);
	            	[qr].filter(validatePair).map(parsePair);
	            }

	            function parsePair(pair){
	            	var splitPair = pair.split('='),
	            	key       = decodeURIComponent(splitPair[0]),
	            	value     = decodeURIComponent(splitPair[1]);

	            	console.log(splitPair, key, value);

	            	table[key] = value;
	            }

	            function validatePair(pair){
	            	var splitPair = pair.split('=');

	            	return !!splitPair[0] && !!splitPair[1];
	            }

	            function validateUrl(){
	            	if(typeof url !== "string") {
	            		throw "QuerystringTable() :: <string url>: expected string, got " + typeof url;
	            	}

	            	if(url == ""){
	            		throw "QuerystringTable() :: Empty string given for argument <string url>";
	            	}
	            }

	            // public
	            function getKeys(){
	            	return Object.keys(table);
	            }

	            function getQuerystring(){
	            	var string;

	            	validateUrl();
	            	string = url.split('?')[1];

	            	if(!string){
	            		string = url;
	            	}

	            	return string;
	            }

	            function getValue(key){
	            	var match = table[key] || null;

	            	if(!match){
	            		return "undefined";
	            	}

	            	return match;
	            }

	            buildTable();
	            this.getKeys        = getKeys;
	            this.getQuerystring = getQuerystring;
	            this.getValue       = getValue;
	        }
	    },

	    path: function (data) {
	       	var waitForRender = function () {
	    		if ($http.pendingRequests.length > 0) {
	    			$timeout(waitForRender);
	    		} else {
	    			$location.path(data);
	    		}
	    	};

	    	$timeout(waitForRender);
	    },

	    safe: function($value, $bool, $trace) {

	    	if($bool === undefined) $bool = true;

	    	var isNull = function (value) {
	    		return typeof value == "object" && value === null;
	    	}

	    	var response = function (result, trace) {
    			if($trace)
    				console.debug(trace)

	    		if($bool) {
	    			return result;
	    		}

	    		return $value;
	    	}

	    	if(isNull($value)) return response(false, "if isNull");

	    	if(!$.isArray($value) && typeof $value === "object" && $value !== null) {
	    		if($.isEmptyObject($value)) return response(false, "if emptyObject");
	    	}

	    	if($.isArray($value) && $value.length == 0) return response(false, "if !isArray || length == 0");

	    	switch (typeof($value)) {
	    		case "boolean":
	    			return response($value, "switch :: boolean");
	    			break;

	    		case "number":
	    			if(isNaN($value)) return response(false, "switch :: number 1");
	    			if($value == 0) return response(false, "switch :: number 2");
	    			if($value == 1) return response(true, "switch :: number 3");
	    			break;

	    		case "string":

	    			if($value.length == 0 || $value == "null") {
		    			$bool = true; // bypass $bool check
	    				return response(false, "switch :: string 1");
	    			}
	    			
	    			$bool = false;
	    			return response(true, "switch :: string 2");
	    			break;

	    		case "undefined":
	    			$bool = true;
	    			return response(false, "switch :: undefined");
	    			break;

	    		default:
	    			return response(true, "switch :: default");
	    			break;
	    	}
	    },

	    normalDateToPhp: function (date) {
	        if(!date) return null;
	        date = date.split('/');
	        return date.reverse().join('-');
	    },

	    truncate: function (string, limiter) {
	    	var $textOverflow = "...";

	    	if(string && limiter) {
	    		if(string.length > limiter)
	    			return string.substring(0, limiter) + $textOverflow;
	    	}

	    	return string ? string : "TRUNCATED STRING";
	    },

	    history: {
	    	back: function () {
	    		$window.history.back();
	    	}
	    },

	    $watchRoot: function (key, fn) {
	    	$timeout(function () {
				$rootScope.$watch(key, function ($changes) {
					if($changes) {
						fn($changes);
					}
				});
			});
	    }
	}

	function HelperSafeTests (fn) {
		var test = [
			0, 1,
			true, false,
			[], [1],
			{}, {a: 1},
			"", "string",
			undefined, null, NaN
		];

		console.warn("Using $bool=true");

		test.forEach(function ($item) {
			console.log("[TESTING] :: ", $item);
			console.log(fn($item, true, true));
		})

		console.warn("Using $bool=false");

		test.forEach(function ($item) {
			console.log("[TESTING] :: ", $item);
			console.log(fn($item, false, true));
		})
	}

	/*window.PublicHelperSafeTests = function () {
		HelperSafeTests($helper.safe);
	}*/

	return $helper;
});