angular
.module('App')
.factory("LoginService", function ($timeout, $http) {
	var LoginService = {
		auth: function (credentials) {

			return new Promise (function (resolve, reject) {
				if(!credentials.username || !credentials.password) return reject("Insira usuário e senha");

				$.ajax({
					url: 'ajax/get.php?module=authUser',
					method: "POST",
					data: credentials
				})
				.success(function (response) {
					if(response) {
						response = JSON.parse(response);

						if(!response.data || response.error)
							return (response.error) ? reject(response.message) : reject();

						resolve(response.data);
					}
				});
			});
		},

		isAuth: function () {
			return new Promise (function (resolve, reject) {
			
				$.ajax({
					url: 'ajax/get.php?module=checkUserSession',
					method: "POST"
				})
				.success(function (response) {
					if(response) {
						response = JSON.parse(response);

						if(!response.hash) return reject("Não está logado");

						resolve(response.data);
					}
				});
			});
		}
	}

	return LoginService;
});