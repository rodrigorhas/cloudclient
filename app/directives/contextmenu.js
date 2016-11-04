angular.module("App")
.directive("contextmenu", function () {
	return {
		restrict: "A",
		link: function (scope, element) {
			console.log("called");
			element.on('contextmenu', function (e) {
				e.preventDefault();
				scope.ContextMenu.create(e);
			});
		}
	}
});