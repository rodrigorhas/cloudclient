angular
.module('App')
.controller("ExplorerDepartamentos", function (
	$scope, $timeout, $location,
	$http, $rootScope, $routeParams,
	$window, Breadcrumbs, DocTypeQuery,
	Database, $filter, USER_TYPES, $mdToast,
	$sce, $helper) {

	$rootScope.currentFolder = DocTypeQuery.data;

	$timeout(function () {
		if($routeParams.departamento == 4 && $rootScope.AllowTo(USER_TYPES.INTERNO)) { // Setor Jurídico - ACESSO INTERNO
			Database
		        .checarValidadeCertidoes()
		        .then(function (response) {
		            var data = response.data;

	                $mdToast.show({
			          hideDelay   : 4 * 1000,
			          position    : 'top right',
			          controller  : 'DepJurToastCtrl',
			          templateUrl : 'app/templates/arquivos/toast-departamento-juridico.html',
			          locals: {certidoes: data}
			        });
		        });
		}
	});

	Breadcrumbs
		.whereAmI($routeParams)
		.then(function (response) {
			Breadcrumbs.set(response);

			$helper.$watchRoot("empresa", function ($changes) {
				$scope.navTitle = $sce.trustAsHtml($changes.nome + " &middot; " + Breadcrumbs.get());
			});
		});

	$scope.openItem = function (folder) {
		var url = $location.path() + '/' + folder.id;

		$location.path(url);
	}

	$rootScope.refreshEmpresaDetails($routeParams);
	$rootScope.initializeComponents();
})
