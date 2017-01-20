angular
.module('App')
.controller("SideNavCtrl",
	function ($scope, $timeout, $rootScope, $routeParams) {

	$rootScope.pages = {
		disabled: true,
		modules: $rootScope.modules
	}
});
