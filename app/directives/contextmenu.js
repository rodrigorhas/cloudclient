angular.module("App")
.directive("contextmenu", ["$timeout", function ($timeout) {
	return {
		restrict: "A",
		link: function (scope, element) {
			element.on('contextmenu', function (e) {
				e.preventDefault();
				scope.ContextMenu.create(e);
			});
		}
	}
}]);