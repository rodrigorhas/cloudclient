angular
.module('App')
.controller("NewDocType", function ($scope, $timeout, $window, $rootScope, Database, $routeParams, $filter) {
	window.scope = $rootScope;
	$scope.form = {
		data: {
			nome: null,
			padrao: false
		},

		clear: function () {
			var self = this;

			self.data.nome = null;
			self.data.padrao = false;
		},

		send: function (event) {
			var self = this;

			if(!self.data.nome) {
				event.preventDefault();
				return Materialize.toast("Preencha o formulário por completo", 4000);
			}

			self.data.ref_departamento = $routeParams.departamento;

			Database
				.newDocType(self.data)
				.then(function (response) {
					$window.location.reload();
				})
		}
	}
})
