angular
.module('App')
.controller("Login", function (
	$scope, $timeout, LoginService,
	$location, $rootScope,$helper, $routeParams) {

	$scope.Login = {
		form: {
			username: null,
			password: null
		},

		login: function () {
			var self = this;

			var url = ($routeParams.redirect) ? `/${$routeParams.redirect}` : null;

			LoginService
				.auth(self.form)
				.then(function (response) {
					$rootScope.user = Object.freeze(response);
					$helper.path(url || "/escolher-modulo");
				})
				.catch(function (message) {
					$helper.toast(message);
				});
		}
	}

	$timeout(function () {
		$(".center.off").addClass("min");
	}, 100);
})
