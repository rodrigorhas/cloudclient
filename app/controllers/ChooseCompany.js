angular
.module('App')
.controller("ChooseCompany", function ($rootScope, $scope, $timeout, LoginService, $window, Database) {

	$("#addCompany").modal();

	Database
		.listEmpresas()
		.then(function (response) {
			$timeout(function () {
				$rootScope.empresas = response.data;

				$timeout(function () {
					if(response.data.length == 1) {
						$("table tr").dblclick();
					}
				})
			});	
		});

	$scope.chooseCompany = function (cnpj) {
		Database
			.chooseCompany({cnpj: cnpj})
			.then(function (response) {
				$rootScope.empresa = response.empresa;

				if(response.success)
					$window.location.href = "#/arquivos/explorar/empresa/" + cnpj;
			});		
	}
})
