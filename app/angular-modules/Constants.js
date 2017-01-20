(function() {
	'use strict';

	angular
	.module('App.Constants', []);

})();

(function () {

	'use strict';

	var USER_TYPES = {
		"FUNCIONARIO": 1,
		"CHEFE": 2,
		"CLIENTE": 3
	}

	USER_TYPES["INTERNO"] = [USER_TYPES["FUNCIONARIO"], USER_TYPES["CHEFE"]];

	angular
		.module('App.Constants')
		.constant("USER_TYPES", USER_TYPES);

})();