angular.module("App")
.directive("contextmenu", function ($rootScope) {
	return {
		restrict: "A",
		scope: true,
		link: function (scope, element) {
			element.on('contextmenu', function (e) {
				e.preventDefault();
				$rootScope.ContextMenu.create(e);
			});
		}
	}
});