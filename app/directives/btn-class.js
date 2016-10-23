angular.module("App")
.directive("btn", function () {
	return {
		restrict: 'C',
		link: function (scope, element) {
			element.not('.btn-icon, input').addClass('waves-effect waves-light');

			Waves.displayEffect();
		}
	}
});