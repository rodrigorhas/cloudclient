angular
.module('App')
.controller("SearchResult", function (
	$scope, $timeout, $location,
	$http, $rootScope, $routeParams,
	$window, Breadcrumbs) {

	Breadcrumbs.set("Pesquisa");

	$rootScope.refreshEmpresaDetails($routeParams);
	$rootScope.initializeComponents();
})
