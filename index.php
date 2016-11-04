<?php header('Content-type: text/html; charset=utf-8'); ?>

<!DOCTYPE html>
<html lang="en" ng-app="App" ng-controller="mainController">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<title>Docs Cacp</title>
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta name="msapplication-tap-highlight" content="no" />

	<link href='http://fonts.googleapis.com/css?family=Roboto:500,300,700,400' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="fonts/zmdi/css/material-design-iconic-font.min.css">

	<link rel="stylesheet" href="app/vendor/angular-material/angular-material.min.css">
	<!-- Compiled and minified CSS -->
	<link rel="stylesheet" href="app/vendor/materializecss/css/materialize.min.css">

	<link rel="stylesheet" href="css/newStyle.css">
</head>

<body fullbleed layout vertical>
	
	<!-- <div class="loading">
		<center>
			<md-progress-circular class="md-hue-2" md-mode="indeterminate"></md-progress-circular>
			<p>Carregando...</p>
		</center>
	</div> -->

	<div ng-view style="width: 100%"></div>

	<script src="js/jquery.js"></script>
	<script src="app/vendor/materializecss/js/index.js"></script>
	
	<script src="js/jquery.ui.touch-punch.min.js"></script>

	<script src="app/vendor/angular/angular.min.js"></script>
	<script src="app/vendor/angular/angular-animate.min.js"></script>
	<script src="app/vendor/angular/angular-aria.min.js"></script>
	<script src="app/vendor/angular/angular-messages.min.js"></script>

	<script src="app/vendor/angular/angular-route.min.js"></script>

	<!-- Angular Material Library -->
	<script src="app/vendor/angular-material/angular-material.min.js"></script>

	<script src="app/vendor/materializecss/js/index.js"></script>
	<script src="js/app.js"></script>
	<script src="app/services/Login.js"></script>
	<script src="app/route.js"></script>
	<script src="app/controllers/Login.js"></script>
	<script src="app/controllers/Explorer.js"></script>
	<script src="app/controllers/ChooseCompany.js"></script>

	<script src="app/directives/autogrow.js"></script>
	<script src="app/directives/btn-class.js"></script>
	<script src="app/directives/icon.js"></script>
	<script src="app/directives/contextmenu.js"></script>
</body>
</html>