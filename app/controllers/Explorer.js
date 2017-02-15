angular
.module('App')
.controller("Explorer", function (
	$scope, $timeout, $location,
	$http, $rootScope, $routeParams, $sce,
	$window, DepartamentosQuery, Breadcrumbs, $helper) {

	$rootScope.departamentos = $rootScope.currentFolder = DepartamentosQuery.data;

	Breadcrumbs.set("Início");

	$helper.$watchRoot("empresa", function ($changes) {
		$scope.navTitle = $sce.trustAsHtml($changes.nome + " &middot; " + Breadcrumbs.get());
	});

	$scope.openItem = function (folder) {
		var url = $location.path() + '/' + folder.id;
		$helper.path(url);
	}

	$rootScope.refreshEmpresaDetails($routeParams);
	$rootScope.initializeComponents();
})
