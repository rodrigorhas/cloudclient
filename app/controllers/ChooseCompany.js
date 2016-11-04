angular
.module('App')
.controller("ChooseCompany", function ($scope, $timeout, LoginService, $window) {
	$scope.empresas = [];

	$.ajax({
		url: "ajax/get.php?module=listEmpresas"
	})
	.success(function (response) {
		if(response) {
			response = JSON.parse(response);

			$timeout(function () {
				$scope.empresas = response;
			});	
		}

	});

	$scope.chooseCompany = function (id) {
		console.log(id);
		$.ajax({
			url: "ajax/get.php?module=chooseCompany",
			data: {id: id}
		})
		.success(function (response) {
			if(response) {
				response = JSON.parse(response);

				if(response.success)
					$window.location.href = "#/explorar/empresa/" + id;
			}

		});		
	}
})
