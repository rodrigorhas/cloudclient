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
	<link rel="stylesheet" href="css/animate.css">

	<link rel="stylesheet" href="app/vendor/angular-material/angular-material.min.css">
	<!-- Compiled and minified CSS -->
	<link rel="stylesheet" href="app/vendor/materialize/materialize.min.css">

	<link rel="stylesheet" href="css/newStyle.css">
</head>

<body fullbleed layout vertical ng-cloak>
	
	<md-sidenav class="md-sidenav-left md-whiteframe-4dp" md-component-id="left">
		<md-toolbar class="md-theme-light">
			<h1 class="md-toolbar-tools">Menu</h1>
		</md-toolbar>

		<md-content layout-padding ng-controller="SideNavCtrl">
			<md-list class="no-padd">
				<md-button ng-repeat="item in pages.modules" ng-disabled="item.disabled" href="{{item.link}}" ng-click="toggleMenu()">
					<icon ng-if="item.icon" name="{{item.icon}}"></icon>
					{{item.name}}
				</md-button>
			</md-list>
		</md-content>
	</md-sidenav>

	<div ng-view style="width: 100%"></div>
	
	<div class="modal" id="modal-search">
		<div class="modal-content row">
			<h5>Formulário de Pesquisa</h5>
	
			<form name="modalSearch">
	
				<div class="col-section-12 clearfix">
					<div class="col s3">
						<md-input-container>
							<label>Mês</label>
							<input ng-model="SearchForm.form.mes" type="number" min="1" max="12">
						</md-input-container>
					</div>
	
					<div class="col s3">
						<md-input-container>
							<label>Ano</label>
							<input ng-model="SearchForm.form.ano">
						</md-input-container>
					</div>
	
					<div class="col s3">
						<md-input-container>
							<label>Vencimento</label>
							<input ng-model="SearchForm.form.vencimento" mask="39/19/9999">
						</md-input-container>
					</div>
				</div>
	
				<div class="col-section-12 clearfix">
	
					<div class="col s6">
						<md-input-container class="md-block" name="departamento">
							<label>Departamento</label>
							<md-select ng-model="SearchForm.form.departamento">
								<md-option ng-repeat="item in departamentos" value="{{item.id}}" ng-click="SearchForm.getTiposDeArquivos(item)">
									{{item.file_name}}
								</md-option>
							</md-select>
						</md-input-container>
					</div>
	
					<div class="col s6">
						<md-input-container class="md-block">
							<label>Tipo do Arquivo</label>
							<md-select ng-model="SearchForm.form.tipoDeArquivo">
								<md-option ng-repeat="type in SearchForm.tipos_de_arquivos" value="{{type.id}}">
									{{type.file_name}}
								</md-option>
							</md-select>
						</md-input-container>
					</div>
				</div>
			</form>
	
		</div>
		<div class="modal-footer">
			<a href="" class=" modal-action modal-close waves-effect waves-green btn-flat" ng-click="SearchForm.search()">Pesquisar</a>
		</div>
	</div>
	
	<div class="modal" id="modal-upload">
		<div class="modal-content row">
			<form 
				method="post"
				enctype="multipart/form-data"
				name="uploadForm"
				ng-submit="UploadBoard.send($event)"
				novalidate>
	
				<p><h5>Fomulário de Cadastro de Arquivo</h5></p>
	
				<div class="col-section-12 clearfix">
					<div class="col s6">
						<md-input-container class="md-block" flex-gt-sm name="departamento">
							<label>Departamento</label>
							<md-select ng-model="UploadBoard.form.department" ng-required="true">
								<md-option ng-repeat="item in departamentos" value="{{item.id}}" ng-click="UploadBoard.getTiposDeArquivos(item)">
									{{item.file_name}}
								</md-option>
							</md-select>
						</md-input-container>
					</div>
	
					<div class="col s6">
						<md-input-container class="md-block" flex-gt-sm>
							<label>Tipo do Arquivo</label>
							<md-select ng-model="UploadBoard.form.type" ng-required="true">
								<md-option ng-repeat="type in UploadBoard.tipo_de_arquivos" value="{{type.id}}">
									{{type.file_name}}
								</md-option>
							</md-select>
						</md-input-container>
					</div>
				</div>
	
				<div class="col-section-12 clearfix mg-t-20">
					<div class="col s4">
						<md-input-container>
							<label>Mês</label>
							<input ng-model="UploadBoard.form.month" type="number" min="1" max="12" required>
						</md-input-container>						
					</div>
	
					<div class="col s4">
						<md-input-container>
							<label>Ano</label>
							<input ng-model="UploadBoard.form.year" type="number" required>
						</md-input-container>
					</div>
	
					<div class="col s4">
						<md-input-container>
							<label>Vencimento</label>
							<input ng-model="UploadBoard.form.vencimento" type="text" mask="39/19/9999">
						</md-input-container>
					</div>
				</div>
	
				<div class="col-section-12 clearfix">
					<div class="col s12">
						<md-input-container class="md-block">
							<label>Observação</label>
							<textarea ng-model="UploadBoard.form.obs" rows="2"></textarea>
						</md-input-container>
					</div>
				</div>
	
				<div class="file-field input-field clearfix">
					<span class="btn">
						<span>Escolher Arquivo</span>
						<input type="file" name="fileAttach" class="fileAttach" ng-model="UploadBoard._fileModel" valid-file required>
					</span>
					<div class="file-path-wrapper">
						<input ng-model="UploadBoard.fileInputName" class="file-path validate" type="text">
					</div>
				</div>
	
				<br>
	
				<button class="btn modal-button" type="submit" ng-disabled="uploadForm.$invalid" raised>Enviar</button>
			</form>
		</div>
	</div>
	
	<div class="modal sm-size" id="modal-doctype-prompt-rename">
		<div class="modal-content">
			<h5 class="modal-header">Alterar nome do Tipo de Arquivo</h5>
	
			<form name="DocTypeRenamePrompt" class="clearfix">
				<md-input-container layout="row">
					<label>Nome</label>
					<input ng-model="DocTypeRenamePrompt.form.nome" type="text">
				</md-input-container>
	
				<div class="right">
					<button class="btn btn-flat modal-action modal-close">cancelar</button>
					<button type="submit" class="btn" ng-click="DocTypeRenamePrompt.send()" ng-disabled="DocTypeRenamePrompt.$invalid" raised>Alterar</button>
				</div>
			</form>
		</div>
	</div>
	
	<div class="modal" id="modal-doctype-prompt-remove">
		<div class="modal-content">
			<h5 class="modal-header">Confirmação</h5>
	
			<form name="DocTypeRemoveConfirm">
	
				<p>Deseja mesmo deletar este <strong>Tipo de Arquivo</strong> ?</p>
				<p>Este Tipo de Arquivo é: <strong>{{DocTypeRemoveConfirm.item.isDefault == 1 ? "Padrão" : "Privado"}}</strong></p>
				<p ng-show="DocTypeRemoveConfirm.item.isDefault == 1"><small><strong>Todos os arquivos de <u>todas as empresas</u> relacionados a este <u>Tipo de Arquivo</u> serão perdidos.</strong></small></p>
				<p ng-show="DocTypeRemoveConfirm.item.isDefault == 0"><small><strong>Todos os arquivos <u>desta</u> empresa relacionado a este <u>Tipo de Arquivo</u> serão perdidos.</strong></small></p>
	
				<br><br>
	
				<button type="submit" class="btn red" ng-click="DocTypeRemoveConfirm.send()" ng-disabled="DocTypeRemoveConfirm.$invalid">Sim</button>
				<button class="btn modal-action modal-close" ng-disabled="DocTypeRemoveConfirm.$invalid">cancelar</button>
			</form>
		</div>
	</div>
	
	<div class="modal" id="modal-file-prompt-remove">
		<div class="modal-content">
			<h5 class="modal-header">Confirmação</h5>
	
			<form name="FilePromptRemove">
	
				<p>Deseja mesmo deletar este <strong>Arquivo</strong> ?</p>
				<p>Criado por: <strong>{{FilePromptRemove.data.usuario + " - " + FilePromptRemove.data.departamento}}</strong></p>
	
				<br><br>
	
				<button type="submit" class="btn red" ng-click="FilePromptRemove.send()" ng-disabled="FilePromptRemove.$invalid">Sim</button>
				<button class="btn modal-action modal-close" ng-disabled="FilePromptRemove.$invalid">cancelar</button>
			</form>
		</div>
	</div>
	
	<div class="modal" id="edit-file">
		<div class="modal-content row">
			<form method="post" enctype="multipart/form-data" name="editFile">
	
				<p><h5>Fomulário de Edição de Arquivo</h5></p>
	
				<md-input-container layout="row">
					<label>Nome do Arquivo</label>
					<input ng-model="EditFile.form.nome" type="text">
				</md-input-container>
	
				<div class="col-section-12 clearfix">
	
					<div class="col s4">
						<md-input-container>
							<label>Mês</label>
							<input string-to-number ng-model="EditFile.form.mes" type="number" min="1" max="12">
						</md-input-container>
					</div>
	
					<div class="col s4">
						<md-input-container>
							<label>Ano</label>
							<input string-to-number ng-model="EditFile.form.ano" type="number">
						</md-input-container>
					</div>
	
					<div class="col s4" ng-if="AllowTo([USER_TYPES.CHEFE])">
						<md-input-container>
							<label>Vencimento</label>
							<input ng-model="EditFile.form.vencimento" type="text" mask="39/19/9999">
						</md-input-container>
					</div>
				</div>
	
				<md-input-container class="md-block">
					<label>Observação</label>
					<textarea ng-model="EditFile.form.obs" rows="5" md-select-on-focus></textarea>
				</md-input-container>
	
				<button class="btn modal-action modal-close" ng-click="EditFile.send()" raised>Salvar</button>
				<button class="btn btn-flat modal-action modal-close">Cancelar</button>
			</form>
		</div>
	</div>
	
	<div class="modal" id="modal-new-doctype" ng-controller="NewDocType">
		<div class="modal-content row">
			<form method="post" enctype="multipart/form-data" name="NewDocType">
	
				<p><h5>Novo Tipo de Arquivo</h5></p>
	
				<md-input-container layout="row">
					<label>Nome</label>
					<input ng-model="form.data.nome" type="text">
				</md-input-container>
	
				<div class="col-section-12">
					<div class="col s6">
						<p><strong>Tipo da pasta</strong></p>
	
						<div class="switch">
							<label>
								Privado
								<input type="checkbox" ng-model="form.data.padrao">
								<span class="lever"></span>
								Padrão
							</label>
						</div>
					</div>
	
					<div class="col s6 demo">
						<div>
							<p><label>Demonstração:</label></p>
							<span><icon name="{{form.data.padrao == 0 ? 'folder-person' : 'folder'}}" class="icon-size-32" /></span>
						</div>
					</div>
				</div>
	
				<div class="col-section-12">
					<div class="col 12">
						
					</div>
				</div>
	
				<p ng-show="form.data.padrao"><span><strong>Essa pasta sera criada para todas as empresas.</strong></span></p>
				<p ng-show="!form.data.padrao"><span><strong>Essa pasta será privada e aparecerá somente para esta empresa.</strong></span></p>
	
				<button class="btn modal-button" ng-click="form.send($event)" raised>Criar</button>
			</form>
		</div>
	</div>

	<script src="js/jquery.js"></script>
	<script src="app/vendor/materialize/materialize.min.js"></script>

	<script src="js/jquery.ui.touch-punch.min.js"></script>
	<script src="app/vendor/momentjs/min/moment.min.js"></script>
	<script src="app/vendor/momentjs/locale/pt-br.js"></script>

	<script src="app/vendor/angular/angular.min.js"></script>
	<script src="app/vendor/angular/angular-animate.min.js"></script>
	<script src="app/vendor/angular/angular-aria.min.js"></script>
	<script src="app/vendor/angular/angular-messages.min.js"></script>

	<!-- Angular Material Library -->
	<script src="app/vendor/angular-material/angular-material.min.js"></script>
	<script src="app/vendor/angular/angular-route.min.js"></script>

	<!-- Angular Material Library -->
	<script src="app/vendor/angular-material/angular-material.min.js"></script>
	<script src="app/vendor/ngMask/ngMask.min.js"></script>

	<script src="app/vendor/ocLazyLoadLoader/index.js"></script>

	<script src="app/angular-modules/Filters.js"></script>
	<script src="app/angular-modules/Constants.js"></script>
	<script src="app/angular-modules/Directives.js"></script>
	<script src="app/angular-modules/Core.js"></script>

	<script src="js/app.js"></script>
	<script src="app/angular-modules/Preloader.js"></script>

	<script src="app/vendor/ocLazyLoadLoader/config.js"></script>

	<script src="app/services/Login.js"></script>
	<script src="app/services/Database.js"></script>
	<script src="app/services/Helper.js"></script>
	<script src="app/services/Breadcrumbs.js"></script>
	<script src="app/services/Store.js"></script>

	<script src="app/route.js"></script>

	<script src="app/filters/cnpj.js"></script>
	<script src="app/filters/orderByObject.js"></script>

	<script src="app/controllers/Login.js"></script>
	<script src="app/controllers/Explorer.js"></script>
	<script src="app/controllers/ExplorerDepartamentos.js"></script>
	<script src="app/controllers/ExplorerTDA.js"></script>
	<script src="app/controllers/Search.js"></script>
	<script src="app/controllers/ChooseCompany.js"></script>
	<script src="app/controllers/ChooseModule.js"></script>
	<script src="app/controllers/FormAddCompany.js"></script>
	<script src="app/controllers/NewDocType.js"></script>
	<script src="app/controllers/Tasks.js"></script>
	<script src="app/controllers/Certidoes.js"></script>

	<script src="app/controllers/Dep-Jur-ToastCtrl.js"></script>
	<script src="app/controllers/SideNavCtrl.js"></script>

	<script src="app/directives/autogrow.js"></script>
	<script src="app/directives/btn-class.js"></script>
	<script src="app/directives/icon.js"></script>
	<script src="app/directives/contextmenu.js"></script>
	<script src="app/directives/disable-selection.js"></script>
	<script src="app/directives/validFile.js"></script>
</body>
</html>