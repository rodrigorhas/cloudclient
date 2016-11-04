angular.module("App")
.config(['$routeProvider',
	function($routeProvider,$routeParams) {
	$routeProvider
		.when('/login', {
			templateUrl: "app/templates/login.html",
			controller: "Login"
		})

		.when('/escolher-empresa', {
			templateUrl: "app/templates/escolher-empresa.html",
			controller: "ChooseCompany"
		})

		.when('/explorar/empresa/:id', {
			templateUrl: "app/templates/explorar-empresa.html",
			controller: "Explorer"
		})

		.when('/estoque', {
			templateUrl: "app/templates/caixa.html",
			controller: "estoque"
		})

		.when('/caixa', {
			templateUrl: "app/templates/caixa.html",
			controller: "caixa"
		})

		.otherwise({redirectTo: '/escolher-empresa'})
}]);