angular
.module('App')
.controller("Login", function ($scope, $timeout, LoginService, $window) {
	$scope.Login = {
		form: {
			username: null,
			password: null
		},

		login: function () {
			var self = this;

			LoginService
				.auth(self.form)
				.then(function () {
					$window.location.hash = "#/escolher-empresa";
				});
		}
	}

	$timeout(function () {
		$(".center").addClass("min");
	});
})
