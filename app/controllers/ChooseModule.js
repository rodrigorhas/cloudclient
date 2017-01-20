angular
.module('App')
.controller("ChooseModule", function (
	$rootScope, $scope, $timeout,
	$location) {

	$scope.choose = function (link) {
		if(link) {
			$location.path(link.substring(1));
		}
	}

	$scope.modules = $rootScope.modules;
})
