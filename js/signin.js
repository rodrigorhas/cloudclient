angular.module("App")
	.controller("SignInController", function ($scope, $http) {

		$scope.form = {
			details: {
				name: "",
				username: "",
				password: "",
				password2: "",
				email: "",
				active: true,
				allowNotifications: true
			},

			submit: function () {
				$http({ method: "post", url: "ajax/get.php" })
					.then(function (response) {

					}, function (response) {
						console.error(response)
					})
			}
		}

		$('.loading').fadeOut(1000);
	});