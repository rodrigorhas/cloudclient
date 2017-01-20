angular
.module('App')
.factory("Breadcrumbs", function ($rootScope, $timeout, $http) {

	var Breadcrumbs = {
		path: "",
		whereAmI: function (data) {
			return new Promise (function (resolve, reject) {
				$.ajax({
					url: 'ajax/get.php?module=whereAmI',
					method: "GET",
					data: data
				})
				.success(function (response) {
					if(response) {
						response = JSON.parse(response);

						if(response.error)
							return (response.error) ? reject(response.message) : reject();

						resolve(response.data);
					}
				});
			});
		},

		set: function (path) {
			$timeout(function () {
				if(!$rootScope.Breadcrumbs) {
					$rootScope.Breadcrumbs = {"path": ""};
				}

				$rootScope.Breadcrumbs.path = path;

				console.log("set");
			});
		},

		get: function () {
			return ($rootScope.Breadcrumbs) ? $rootScope.Breadcrumbs.path : "";
		}
	}

	return Breadcrumbs;
});