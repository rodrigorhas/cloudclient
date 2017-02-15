angular
.module('App')
.controller("DepJurToastCtrl",
	function ($rootScope, $scope, $timeout,
		LoginService, $window, Database,
		certidoes, $mdDialog, $mdToast, $location) {

		$scope.closeToast = function () {
			$mdToast.hide();
		}

		if(certidoes.length) {
			var msg = (certidoes.length > 1) ? "Algumas certidões estão" : "Uma certidão está";
			$scope.message = `${msg} perto de expirar`;
		}

		$scope.openMoreInfo = function (e) {
			$mdDialog.show({

				clickOutsideToClose: true,
				locals: {data: certidoes},

				controller: ['$scope', 'data', '$helper', function ($scope, data, $helper) {
					$scope.data = data;
					$scope.$helper = $helper;

					$scope.remaining = function (vencimento, formated) {
						var now = moment().format("YYYY-MM-DD");
						var v = moment(vencimento);
						var res = v.diff(now, "days");
						
						return formated ? `${res + ' dia' + (res > 1 || res < -1 ? 's' : '')}` : res;
					}

					$scope.viewFile = function (item) {
						window.open(item.link, item.hash);
					}
				}],

				template:
					`<md-dialog>
					  <md-dialog-content class="md-dialog-content">
					  	<h5>Listagem de Certidões</h5>
					  	<table class="bordered">
							<thead>
								<tr>
									<th>Nome</th>
									<th>Referência</th>
									<th>Data de Envio</th>
									<th>Vencimento</th>
									<th>Restam</th>
								</tr>
							</thead>
							<tbody>
								<tr 
									class="cursor-pointer"
									ng-repeat="item in data track by $index"
									ng-dblclick="viewFile(item)"
								>
									<td title="{{item.nome}}">{{$helper.truncate(item.nome, 35)}}</td>
									<td>{{item.mes + '/' + item.ano}}</td>
									<td>{{item.data | date: 'dd/MM/yyyy'}}</td>
									<td>{{item.vencimento | date: 'dd/MM/yyyy'}}</td>
									<td class="center" ng-class="{'text-red': remaining(item.vencimento) <= 0}">{{remaining(item.vencimento, true)}}</td>
								</tr>
							</tbody>
						</table>
					  </md-dialog-content>
					</md-dialog>`
			});

			$mdToast.hide();
		}
	});
