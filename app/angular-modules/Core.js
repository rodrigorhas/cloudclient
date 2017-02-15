(function () {

	'use strict';

	angular.module("App.Core", [
		'ngMaterial',
		'ngMask',
		'App.Preloader',
		'App.Constants',
		'App.Filters',
		'App.Directives',
	]);

})();

(function () {
	'use strict';

	angular
		.module("App.Nevernotes", [
			'ngStorage',
			'ngTouch',
			'ngSanitize',
			'indexedDB',
			//'ui.materialize'
		]);
})();