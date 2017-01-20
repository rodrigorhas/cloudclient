angular.module("App")
.directive("disableSelection",["$timeout", function ($timeout) {
	return {
		restrict: "A",
		link: function (scope, element) {
			$timeout(() => element.disableSelection());
		}
	}
}]);