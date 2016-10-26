<?php header('Content-type: text/html; charset=utf-8'); ?>

<!DOCTYPE html>
<html lang="en" ng-app="App" ng-controller="mainController">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<title>Cloud Client</title>
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta name="msapplication-tap-highlight" content="no" />

	<link href='http://fonts.googleapis.com/css?family=Roboto:500,300,700,400' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="fonts/zmdi/css/material-design-iconic-font.min.css">

	<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.css">
	<!-- Compiled and minified CSS -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/css/materialize.min.css">

	<link rel="stylesheet" href="css/newStyle.css">
</head>

<body fullbleed layout vertical>
	
	<div class="loading">
		<center>
			<md-progress-circular class="md-hue-2" md-mode="indeterminate"></md-progress-circular>
			<p>Carregando...</p>
		</center>
	</div>

	<div class="login">
		<!-- <paper-ripple id="logTouchFx"></paper-ripple> -->
		<div class="center in hide">
			<img class="userPhoto">
			<span class="userName"></span>
			
			<form action="" class="form">
				<div class="input-field">
					<input label="Password" type="password"></input>
				</div>
			</form>
			
			<div class="block">
				<button class="btn" ng-click="logOff()">sair</button>
				<button class="btn btn-raised" ng-click="logConfirm()">confirmar</button>
			</div>
		</div>
		<div class="center off">

			<!-- <img class="logo" src="icons/logo.fw.png" /> -->
			<img alt="" class="userPhoto">

			<form action="" class="form">
				<div class="input-field">
					<input label="Username" id="username" placeholder="Nome de usuario" ng-model="uname"></input>
				</div>
			</form>

			<div class="part2 hide">

				<form action="" class="form">
					<div class="input-field">
						<input label="Password" type="password" ng-model="upass"></input>
					</div>
				</form>

				<div class="block">
					<button class="btn btn-flat text-white" ng-click="logOff()">sair</button>
					<button class="btn" ng-click="logConfirm()">confirmar</button>
				</div>
			</div>

		</div>
	</div>

	<nav>
		<div class="nav-wrapper">
			<button class="btn btn-flat" ng-click="toggleLeft()"><icon name="menu" ></icon></button>
			<!-- <icon ng-show="bcCurr < bc.length-1 && ws > 640 " name="arrow-forward" ng-click="bcForward()"></icon> -->
			<button class="btn btn-flat" ng-show="bc.length > 1" ng-click="bcBack()">
				<icon name="arrow-back" ></icon>
			</button>

			<span class="breadcrumbs">{{breadcrumbs()}}</span>

			<div class="right">
				<button class="btn btn-flat" ng-show="ws > 640" ng-click='fullscreen($event)'><icon  name="fullscreen" ></icon></button>
				<button class="btn btn-flat" ng-click="changeView()" ng-show="ws > 640"><icon name="{{viewType}}"></icon></button>
				<a href="#modal1" class="btn btn-flat modal-trigger"><icon name="search"></icon></a>
			</div>
		</div>
	</nav>

	<div class="editMode" horizontal layout ng-class="{'active': EditMode.active}">
		<span class="brand" flex ng-if="EditMode.selection.length != 0" >{{EditMode.selection.length}} <div class="inline" ng-if="EditMode.selection.length > 1">itens selecionados</div><div class="inline" ng-if="EditMode.selection.length == 1">item selecionado</div></span>
		<span flex ng-if="EditMode.selection.length == 0"></span>
		<span ng-show="ws > 640">
			<button class="btn" ng-click="toggleDialog()">
				<svg style="width:24px;height:24px" viewBox="0 0 24 24">
					<path fill="white" d="M9,18V15H5V11H9V8L14,13M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z" />
				</svg>
				Mover
			</button>
			<button class="btn" ng-click="EditMode.selectAll()">
				<icon name="done-all"></icon>
				selecionar todos
			</button>
			<button class="btn" ng-click="EditMode.deleteSelection()">
				<icon name="delete"></icon>
				delete
			</button>
			<button class="btn" ng-click="EditMode.setState(false, $event)">
				<icon name="block"></icon>
				cancelar
			</button>
		</span>
		<span ng-show="ws < 640">
			menu em construção
		</span>
	</div>

	<br/>

				<!-- <aside>
					<div class="tree">
						<script type="text/ng-template" id="categoryTree"> 
							<span class="before" ng-if="category.is_folder == 1 && " ng-click="toggleFolder($event)">‣</span>
				
							<div class="folder" ng-click="openFolder(category, $index);toggleFolder($event, true)" title="{{category.file_name}}">
								<icon name="folder"></icon>
								<span class="folder_name">{{category.file_name}}</span>
							</div>
				
							<div class="sub-item" ng-if="category.children.length">
								<div class="item" ng-repeat="category in category.children" ng-if="category.is_folder == 1" ng-include="'categoryTree'"></div>
							</div>
						</script>
						<div class="item" ng-repeat="category in categories" ng-if="category.is_folder" ng-include="'categoryTree'"></div>
					</div>
				</aside> -->

				<div class="archive_viewer">
					<div class="shortcuts view-list">

						<div ng-if="currentViewType == 'folder-list'">
							<div class="icon" data-id="{{file.id}}" data-index="{{$index}}" ng-repeat="file in currentFolder | filter: {file_name: fileSearch, deleted: 0} " title="{{file.file_name}}" on-last-repeat>
								<div class="content-container" ng-if="file.is_folder == 1" ng-dblclick="openFolder(file, $index, $event)" data-tap="true" layout horizontal>
									<span flex>
										<icon name="folder"></icon>
										<p>{{file.file_name}}</p>
									</span>
								</div>
								<div class="content-container" ng-if="file.is_folder == 0" ng-dblclick="validFormat(file)" data-tap="true" layout horizontal>
									<span flex>
										<icon name="file"></icon>
										<p>{{file.file_name}}</p>
									</span>
								</div>
							</div>
						</div>
						<div ng-if="currentViewType == 'file-table'">
							<table>
								<thead>
									<tr>
										<th data-field="nome">Nome do arquivo</th>
										<th data-field="referencia">Referência</th>
										<th data-field="data">Data de criação</th>
										<th data-field="tipo">Tipo</th>
									</tr>
								</thead>

								<tbody>
									<tr ng-repeat="item in currentFolder" contextmenu data-id="{{item.raw.id}}">
										<td>{{item.raw.nome}}</td>
										<td>{{item.raw.referencia}}</td>
										<td>{{item.raw.data}}</td>
										<td>{{item.raw.tipo}}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<div class="upload_board">
					<div class="up-header">
						Central de uploads
						<div class="up-close" ng-click="closeUb($event)">&times;</div>
					</div>

					<div class="row">
						<div class="col s12">
							<ul class="tabs">
								<li class="tab col s3"><a href="#em_andamento">em andamento</a></li>
								<li class="tab col s3"><a class="active" href="#enviar">enviar</a></li>
							</ul>
						</div>
						<div id="em_andamento" class="col s12">
							<section id='upload-list'>
								<div class="up-body">
									<table class="table table-hover">
										<thead>
											<th>Nome do arquivo</th>
											<th>Progresso</th>
											<th>Opçoes</th>
										</thead>
										<tbody>
											<tr ng-repeat="item in UploadBoard.inProgress" id="{{item.id}}">
												<td>{{item.file_name}}</td>
												<td>
													<div class="progress">
														<div class="determinate" style="width: {{item.progress}}%"></div>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</section>
						</div>
						<div id="enviar" class="col s12">
							<section class="upload-container container">
								
							</section>				
						</div>
					</div>		
				</div>

				<div class="media_viewer">
					<div class="v-container" layout horizontal>
						<div class="v-body" flex nine>
							<div class="menu">
								<button class="btn btn-flat" ng-click="toggleViewer(null, false)">
									<icon name="info"></icon>
								</button>
								<button class="btn btn-flat" ng-click="toggleViewer(null, false)">
									<icon name="share"></icon>
								</button>
								<button class="btn btn-flat" ng-click="toggleViewer(null, false)">
									<icon name="download"></icon>
								</button>
								<button class="btn btn-flat" ng-click="toggleViewer(null, false)">
									<icon name="close"></icon>
								</button>
							</div>
							<div class="align-middle"></div>
						</div>
					</div>
				</div>

				<div class="fab">
					<div ng-mouseleave="visible = false;">
						<button class="button waves-effect waves-light" ng-mouseenter="visible = true;" ng-class="{hover: visible}" ng-click="visible = false">
							<icon class="icon first-icon" name="plus"></icon>
							<icon class="icon second-icon" name="close"></icon>
						</button>
						<content ng-class="{show: visible, hide: !visible}">
							<ul>
						<!-- <li>
							<button class="btn-floating dark-gray" data-tooltip="Compartilhar pasta atual" ng-click="visible = false;">
								<icon name="share"></icon>
							</button>
						</li> -->
						<li>
							<button class="btn-floating blue" data-tooltip="Criar nova pasta" ng-click="createFolder(currentFolder); visible = false;">
								<icon name="folder"></icon>
							</button>
						</li>
						<li>
							<a href="#modal-upload" class="btn-floating purple modal-trigger" data-tooltip="Enviar arquivo" ng-click="visible = false;">
								<icon name="upload"></icon>
							</a>
						</li>
					</ul>
				</content>
			</div>
			<fab-overlay ng-class="{show: visible}"></fab-overlay>
		</div>

	<!-- <div class="drawer">
		<overlay></overlay>
		<content>
			<toolbar vertical layout>
				<span flex>Drawer</span>
			</toolbar>
		</content>
	</div> -->

	<md-sidenav class="md-sidenav-left md-whiteframe-z2" md-component-id="left">
		<content>
			<div>
				<toolbar vertical layout>
					<img class="user-photo" ng-src="{{userImg}}" alt="">
					<img src="img/user-wp.jpg" alt="" class="cover">
					<span flex>rodrigorhas@gmail.com</span>
				</toolbar>

				<ul class="infinity-list">
					<li class="list-item">
						<span fit>Home</span>
						<paper-ripple fit ng-click="Sidenav.close();"></paper-ripple>
					</li>
					<li class="list-item">
						<span fit>Compartilhados</span>
						<paper-ripple fit ng-click="Sidenav.close();"></paper-ripple>
					</li>
					<li class="list-item">
						<span fit>Favoritos</span>
						<paper-ripple fit ng-click="Sidenav.close();"></paper-ripple>
					</li>
					<li class="list-item">
						<span fit>Recentes</span>
						<paper-ripple fit ng-click="Sidenav.close();"></paper-ripple>
					</li>
					<li class="list-item">
						<span fit>Lixeira</span>
						<paper-ripple fit ng-click="Sidenav.close()"></paper-ripple>
					</li>

					<li class="divider"></li>
					
					<li class="list-item">
						<span fit>Configurações</span>
						<paper-ripple fit ng-click="Sidenav.close()"></paper-ripple>
					</li>
					<li class="list-item">
						<span fit>Sobre</span>
						<paper-ripple fit ng-click="Sidenav.close()"></paper-ripple>
					</li>
				</ul>
			</div>

			<bottom-toolbar>
				<span flex>0.1GB / 10GB <div class="pull-right">(1%)</div></span>
			</bottom-toolbar>

		</content>
	</md-sidenav>

	<div id="modal-upload" class="modal">
		<div class="modal-content">
			<form method="post" enctype="multipart/form-data">

				<h5>Fomulário de Cadastro de Arquivo</h5>

				<md-input-container>
					<label>Nome do Arquivo</label>
					<input ng-model="UploadBoard.form.file_name">
				</md-input-container>

				<md-input-container>
					<label>Mês</label>
					<input ng-model="UploadBoard.form.month" type="number" min="1" max="12">
				</md-input-container>

				<md-input-container>
					<label>Ano</label>
					<input ng-model="UploadBoard.form.year" type="number">
				</md-input-container>

				<md-input-container class="md-block" flex-gt-sm>
					<label>Tipo do Arquivo</label>
					<md-select ng-model="UploadBoard.form.type">
						<md-option ng-repeat="type in all_file_types" value="{{type.id}}">
							{{type.nome}}
						</md-option>
					</md-select>
				</md-input-container>

				<div class="file-field input-field clearfix">
					<span class="btn">
						<span>Escolher Arquivo</span>
						<input type="file" name="fileAttach" class="fileAttach" ng-model="UploadForm.form.file">
					</span>
					<div class="file-path-wrapper" ng-show="UploadForm.form.file">
						<input class="file-path validate" type="text">
					</div>
				</div>

				<br>

				<button class="btn" ng-click="UploadBoard.send()" raised>Enviar</button>
			</form>
		</div>
	</div>

	<div id="modal1" class="modal">
		<div class="modal-content">
			<h4>Formulário de Pesquisa</h4>

			<p>
				<md-input-container>
					<label>Mês</label>
					<input ng-model="SearchForm.form.mes" type="number" min="1" max="12">
				</md-input-container>

				<md-input-container>
					<label>Ano</label>
					<input ng-model="SearchForm.form.ano">
				</md-input-container>

				<md-input-container>
					<label>Tipo do Arquivo</label>
					<md-select ng-model="SearchForm.form.tipo_de_arquivo">
						<md-option ng-repeat="item in all_file_types" ng-value="item.id">
							{{item.nome}}
						</md-option>
					</md-select>
				</md-input-container>
			</p>

		</div>
		<div class="modal-footer">
			<a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat" ng-click="SearchForm.search()">Pesquisar</a>
		</div>
	</div>

	<script src="js/jquery.js"></script>
	<script src="js/jquery-ui.js"></script>
	<script src="app/vendor/materializecss/js/index.js"></script>
	
	<script src="js/jquery.ui.touch-punch.min.js"></script>
	<!-- <script src="js/angular-min.js"></script> -->

	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-animate.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-aria.min.js"></script>
	<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular-messages.min.js"></script>

	<!-- Angular Material Library -->
	<script src="http://ajax.googleapis.com/ajax/libs/angular_material/1.1.0/angular-material.min.js"></script>

	<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/js/materialize.min.js"></script>
	<script src="js/app.js"></script>

	<script src="app/directives/autogrow.js"></script>
	<script src="app/directives/btn-class.js"></script>
	<script src="app/directives/icon.js"></script>
	<script src="app/directives/contextmenu.js"></script>
</body>
</html>