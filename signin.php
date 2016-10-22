<!DOCTYPE html>
<html lang="en" ng-app="App">
<head>
	<meta charset="utf-8">
	<title>Cloud Client</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="msapplication-tap-highlight" content="no" />

	<script src="components/webcomponentsjs/webcomponents.js"></script>
	<link rel="import" href="components/polymer/polymer.html">
	<link rel="import" href="components/font-roboto/roboto.html">
	<link rel="import" href="components/paper-elements/paper-elements.html">
	<link rel="import" href="components/core-toolbar/core-toolbar.html">
	<link rel="import" href="components/core-header-panel/core-header-panel.html">
	<link rel="import" href="components/core-scroll-header-panel/core-scroll-header-panel.html">
	<link rel="import" href="components/paper-icon-button/paper-icon-button.html">
	<link rel="import" href="components/paper-menu-button/paper-menu-button.html">
	<link rel="import" href="components/paper-shadow/paper-shadow.html">
	<link rel="import" href="components/paper-button/paper-button.html">
	<link rel="import" href="components/paper-ripple/paper-ripple.html">
	<link rel="import" href="components/paper-dialog/paper-action-dialog.html">
	<link rel="import" href="components/paper-tabs/paper-tabs.html">
	<link rel="import" href="components/paper-fab/paper-fab.html">
	<link rel="import" href="components/core-icons/social-icons.html">
	<link rel="import" href="components/core-menu/core-menu.html">
	<link rel="import" href="components/core-pages/core-pages.html">
	<link rel="import" href="components/paper-toast/paper-toast.html">
	<!-- css -->
	<link href='http://fonts.googleapis.com/css?family=Roboto:500,300,700,400' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.9.0/angular-material.min.css">
	<link href="css/bootstrap.min.css" rel="stylesheet" />
	<link href="css/jquery-ui.css" rel="stylesheet" />
	<link rel="stylesheet" href="css/newStyle.css">
  </head>
	
	<body fullbleed layout vertical ng-controller="SignInController">
	
	<div class="loading">
		<center>
			<md-progress-circular class="md-hue-2" md-mode="indeterminate"></md-progress-circular>
			<p>Carregando...</p>
		</center>
	</div>

	<div class="row">
		<div class="container">
			<div class="card col-md-8 col-md-offset-2">
				<div class="alert alert-success" ng-if="alert">
				  <strong>Sucesso!</strong> Conta criada com sucesso.
				</div>
				<br>
				<form action="ajax/get.php?module=signin" method="POST">
					<p><paper-input label="Nome" ng-model="form.details.name"></paper-input></p>
					<p><paper-input label="Nome de usuario" ng-model="form.details.username"></paper-input></p>
					<p><paper-input label="Senha" ng-model="form.details.password"></paper-input></p>
					<p><paper-input label="Confirmar senha" ng-model="form.details.password2"></paper-input></p>
					<p><paper-input label="Email" ng-model="form.details.email"></paper-input></p>
					<br>
					<p><paper-checkbox label="Receber notificaçõs por email" ng-model="form.details.allowNotifications"></paper-checkbox></p>
					<p><paper-checkbox label="Ativo" ng-model="form.details.active"></paper-checkbox></p>
					<br>
					<p><paper-button>reset</paper-button><paper-button raised ng-click="form.submit()">confirmar</button></p>
				</form>
			</div>
		</div>
	</div>

	<script src="js/jquery.js"></script>
	<script src="js/jquery-ui.js"></script>
	<script src="js/bootstrap.min.js"></script>
	
	<script src="js/jquery.ui.touch-punch.min.js"></script>
	<!-- <script src="js/angular-min.js"></script> -->
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-aria.min.js"></script>

    <script src="https://ajax.googleapis.com/ajax/libs/angular_material/0.9.0/angular-material.min.js"></script>
	<script src="js/signin.js"></script>
	</body>
</html>