angular
.module('App')
.factory("Database", function ($timeout, $http, $helper) {

	var BestReject = function (message, reject) {
		$helper.toast(message);
		console.error(message);
		reject();
	};

	var json = function (response) {
		return new Promise (function (resolve, reject) {
			try {

				if(response) {
					response = JSON.parse(response);
				}

				else return reject("Empty response");

				if(response.success){
					if(response.message) {
						$helper.toast(response.message);
					}

					resolve(response);
				}

				else if(response.error)
					return (response.message) ? BestReject(response.message, reject) : reject();
			}

			catch (e) {
				reject(e);
			}
		});
	};

	var Database = {
		newDocType: function (data) {
			return new Promise (function (resolve, reject) {
				$.ajax({
					url: 'ajax/get.php?module=newDocType',
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(reject);
				});
			});
		},

		renameDocType: function (data) {
			return new Promise (function (resolve, reject) {
				var a = $.ajax({
					url: 'ajax/get.php?module=renameDocType',
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(reject);
				});
			});
		},

		removeDocType: function (data) {
			return new Promise (function (resolve, reject) {
				$.ajax({
					url: 'ajax/get.php?module=removeDocType',
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(reject);
				});
			});
		},

		uploadFile: function (data) {
			return new Promise (function (resolve, reject) {
 				$.ajax({
 					url: "ajax/get.php?module=uploadFile",
 					type: 'POST',
 					data: data,
 					cache: false,
 					contentType: false,
 					processData: false
 				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(reject);
				});
			});
		},

		getDepartamentos: function (data) {
			return new Promise (function (resolve, reject) {
 				$.ajax({
 					url: "ajax/get.php?module=getDepartamentos",
 					type: 'POST'
 				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(function () {
							console.error('PROMISE getDepartamentos :: REJECTED');
							reject();
						});
				});
			});
		},

		getDocType: function (data) {
			return new Promise (function (resolve, reject) {
				$.ajax({
					url: "ajax/get.php?module=getTipoDeArquivos",
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(function () {
							console.error('PROMISE getDocType :: REJECTED');
							reject();
						});
				});
			});
		},

		getDocs: function (data) {
			return new Promise (function (resolve, reject) {

				$.ajax({
					url: "ajax/get.php?module=getArquivos",
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(function () {
							console.error('PROMISE getDocs :: REJECTED');
							reject();
						});
				});
			});
		},

		editFile: function (data) {
			return new Promise (function (resolve, reject) {

				$.ajax({
					url: "ajax/get.php?module=editFile",
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(reject);
				});
			});
		},

		deleteDoc: function (data) {
			return new Promise (function (resolve, reject) {

				$.ajax({
					url: "ajax/get.php?module=deleteDoc",
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(reject);
				});
			});
		},

		chooseCompany: function (data) {
			return new Promise (function (resolve, reject) {
				$.ajax({
					url: "ajax/get.php?module=chooseCompany",
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(reject);
				});
			});
		},

		listEmpresas: function () {
			return new Promise (function (resolve, reject) {
				$.ajax({
					url: "ajax/get.php?module=listEmpresas",
					method: "POST"
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(reject);
				});
			});
		},

		checarValidadeCertidoes: function (data) {
			return new Promise (function (resolve, reject) {

				$.ajax({
					url: "ajax/get.php?module=checarValidadeCertidoes",
					method: "POST"
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(function () {
							console.error('PROMISE :: REJECTED');
							reject();
						});
				});
			});
		},

		search: function (data) {
			return new Promise (function (resolve, reject) {

				$.ajax({
					url: "ajax/get.php?module=search",
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(function () {
							console.error('PROMISE :: REJECTED');
							reject();
						});
				});
			});
		},

		newCompany: function (data) {
			return new Promise (function (resolve, reject) {
				$.ajax({
					url: "ajax/get.php?module=newCompany",
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(function () {
							console.error('PROMISE :: REJECTED');
							reject();
						});
				});
			});
		},

		newDefaultUser: function (data) {
			return new Promise (function (resolve, reject) {
				$.ajax({
					url: "ajax/get.php?module=newDefaultUser",
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(function () {
							console.error('PROMISE :: REJECTED');
							reject();
						});
				});
			});
		},

		checarValidadeDeTodasAsCertidoes: function (data) {
			return new Promise (function (resolve, reject) {
				$.ajax({
					url: "ajax/get.php?module=checarValidadeDeTodasAsCertidoes",
					method: "POST",
					data: data
				})
				.success(function (response) {
					json(response)
						.then(resolve)
						.catch(function () {
							console.error('PROMISE :: REJECTED');
							reject();
						});
				});
			});
		}
	}

	return Database;
});