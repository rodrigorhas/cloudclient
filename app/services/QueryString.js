angular
	.module('App')
	.factory("QueryString", function ($rootScope, $timeout, $http, $mdToast, $location) {

		var public = {
			table: []
		}

		var url = $location.url();

		public.getParams = function () {

			var self = this;

			var buildTable = function (){
				var qr = getQuerystring();
				if(qr.indexOf("&") > 1) {
					return qr.split('&').filter(validatePair).map(parsePair);
				}

				[qr].filter(validatePair).map(parsePair);
			}

			function parsePair(pair){
				var splitPair = pair.split('='),
				key       = decodeURIComponent(splitPair[0]),
				value     = decodeURIComponent(splitPair[1]);

				self.table[key] = value;
			}

			function validatePair(pair){
				var splitPair = pair.split('=');

				return !!splitPair[0] && !!splitPair[1];
			}

	        buildTable();

	        return this.table;
		}

		public.getKeys = function () {
			return Object.keys(this.getParams());
		}

		function validateUrl(){
			if(typeof url !== "string"){
				throw "QuerystringTable() :: <string url>: expected string, got " + typeof url;
			}

			if(url == ""){
				throw "QuerystringTable() :: Empty string given for argument <string url>";
			}
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

		return public;
	});