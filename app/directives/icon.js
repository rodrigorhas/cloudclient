angular.module("App").directive("icon", function () {
	return {
		restrict: 'E',
		replace: false,

		template: '<i class="zmdi zmdi-{{name}}"></i>',

		link: function (scope, element, attrs) {
			if(attrs.size) {
				console.log('write');
				element.css("fontSize", attrs.size + "px");
			}
		},

		scope: {
			name: '@',
			size: '@'
		}
	}
});