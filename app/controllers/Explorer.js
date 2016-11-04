angular
.module('App')
.controller("Explorer", function ($scope, $timeout, $location, $http, $rootScope) {

	$rootScope.currentViewType = "folder-list";
	$rootScope.currentFolder = [];
	$rootScope.departamentos = [];

	$scope.bcBack = function (){
		if ($rootScope.bc.length > 1){

			$rootScope.bc.pop();

			if($rootScope.bc.length == 1) {
				$rootScope.currentFolder = $rootScope.departamentos;
				$rootScope.currentViewType = 'folder-list';
			}

			else if ($rootScope.bc.length == 2) {
				$rootScope.currentViewType = 'folder-list';
				$rootScope.currentFolder = $rootScope.tipo_de_arquivo;
			}
		}
	}

	$scope.breadcrumbs = function () {

		var crumb = $scope.bc.reduce(function (crumb, item) {
			if(item) {
				return crumb += item.file_name + "/";
			}
		}, "");


		return crumb;
	}

	$scope.onRepeatLast = function (callback){
		$scope.$on('onRepeatLast', function(scope, element, attrs){
			callback();
		});
	}

	$scope.openFolder = function (folder) {

		switch (folder.type) {
			case "departamentos": 
				$http.get("ajax/get.php?module=getTipoDeArquivos&departamento=" + folder.id).success(function(data) {
					$timeout(function () {
						$rootScope.bc.push(folder);
						$rootScope.currentFolder = data;
						$rootScope.tipo_de_arquivo = data;
						$rootScope.currentViewType = 'folder-list';
					});
				});
			break;

			case "tipo_de_arquivo": 
				$http
					.get("ajax/get.php?module=getArquivos&tipo_de_arquivo=" + folder.id)
					.success(function(data) {
						$timeout(function () {
							$rootScope.bc.push(folder);
							$rootScope.currentFolder = data;
							$rootScope.currentViewType = 'file-table';
						});
					});
			break;
		}
	}

	$.ajax({
		url: "ajax/get.php?module=getDepartamentos",
		method: "POST"
	})
	.success(function (response) {
		response = JSON.parse(response);

		$rootScope.currentFolder = response;
		$rootScope.departamentos = response;
		$rootScope.bc.push({file_name: "Empresa"});
	});
})
