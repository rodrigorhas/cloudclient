angular
.module('App')
.controller("ExplorerTDA", function (
	$scope, $timeout, $location, $http,
	$rootScope, $routeParams, $window, USER_TYPES,
	Breadcrumbs, DocsQuery, TipoDeArquivoQuery, $sce,
	$helper) {

	Breadcrumbs
		.whereAmI($routeParams)
		.then(function (response) {
			Breadcrumbs.set(response);

			$helper.$watchRoot("empresa", function ($changes) {
				$scope.navTitle = $sce.trustAsHtml($changes.nome + " &middot; " + Breadcrumbs.get());
			});
		});

	var safe = $rootScope.safe;

	// Funcao que faz o attr title da TR

	$scope.buildTitle = function (item) {
		var title = [];
		var listDecorator = "* ";

		var capitalize = function (word) {
			return word[0].toUpperCase() + word.substring(1).toLowerCase();
		}

		var saw = "Visualizado pelo cliente";

		if(safe(item.visualizado_em)) {
			title.push(saw);
		}

		else {
			title.push(`Não ${saw}`);
		}

		if(!safe(item.available)) {
			title.push("Arquivo indisponível");

			if($rootScope.AllowTo(USER_TYPES.CLIENTE)) {
				title.push("Ações indisponíveis");
			}
		}

		// Add list decorator
		title = title.map(function (item) {
			return `${listDecorator}${capitalize(item)}`;
		});

		return title.join("\n");
	}

	// Funcao de ordem da tabela

	$scope.orderBy = function (field) {
		$scope.orderByField = field;
		$scope.reverseSort = !$scope.reverseSort
	}

	// Adiciona o campo referencia nos items

	var $data = DocsQuery.data;

	$data.forEach(function (item) {
		item.referencia = `${item.mes}/${item.ano}`;
	});

	$rootScope.currentFolder = $data;

	// Se ja tiver os dados, seta os campos do modal de upload

	if($routeParams.departamento) {
		$rootScope.UploadBoard.form.department = $routeParams.departamento;
	}

	if(TipoDeArquivoQuery.data) {
		$rootScope.UploadBoard.tipo_de_arquivos = TipoDeArquivoQuery.data;

		$timeout(function () {
			$rootScope.UploadBoard.form.type = $routeParams.tipo;
		});
	}

	// Router procedure

	$rootScope.refreshEmpresaDetails($routeParams);
	$rootScope.initializeComponents();
});