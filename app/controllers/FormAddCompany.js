angular
	.module('App')
	.controller("FormAddCompany", function (
		$scope, $timeout, $location,
		$http, $rootScope, $routeParams,
		$window, Database) {

		var processCNPJ = function (cnpj) {
			return cnpj
					  .replace('/', '')
					  .replace('-', '')
					  .replace(/\./g, '');
		}

		$scope.form = {
			data: {
				company: {
					nome: null,
					cnpj: null
				},

				user: {
					usuario: null,
					senha: null
				}
			},

			clearForm: function () {
				var self = this;

				$timeout(function () {
					self.data = {
						company: {
							nome: null,
							cnpj: null
						},

						user: {
							usuario: null,
							senha: null
						}
					}
				});
			},

			save: function () {

				var self = this;

				if(self.data.company.nome && self.data.company.cnpj) {
					var cnpj = processCNPJ(self.data.company.cnpj);
					var nome = self.data.company.nome.toUpperCase();

					var req = {nome: nome, cnpj: cnpj};

					Database
						.newCompany(req)
						.then(function (response) {
							$timeout(function () {
								$rootScope.empresas.push(response.data);
							});
						});
				}

				if(self.data.user.usuario && self.data.user.senha) {
					Database.newDefaultUser(self.data.user);
				}
			}
		}
	});
