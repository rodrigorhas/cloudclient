angular
.module('App')
.controller("App.Arquivos.Certidoes", function (
	$scope, $timeout, $location,
	$http, $rootScope, $routeParams,
	$window, Breadcrumbs, $helper, CertidoesQuery,
	$helper, $store) {

	$scope.empresas = CertidoesQuery.data.data;

	$scope.$helper = $helper;

	$(".collapsible").collapsible();

	$scope.remaining = function (vencimento, formated) {
		var now = moment().format("YYYY-MM-DD");
		var v = moment(vencimento);
		var res = v.diff(now, "days");
		
		return formated ? `${res + ' dia' + (res > 1 || res < -1 ? 's' : '')}` : res;
	}

	$scope.buildTitle = function (vencimento) {
		var res, $r = $scope.remaining(vencimento);

		if($r < 0) {
			var dias = ($r < -1) ? "dias" : "dia";
			res = "Venceu a " + Math.abs($r) + " " +  dias;
		}

		else {
			res = "Vence(u) hoje";
		}

		return res;
	}

	$scope.viewFile = function (item) {
		window.open(item.link, item.hash);
	}

	//$rootScope.initializeComponents();
});
