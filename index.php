<!DOCTYPE html>
<html lang="en" ng-app="App" ng-controller="mainController">
<head>
	<meta charset="utf-8">
	<title>Cloud Client</title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta name="msapplication-tap-highlight" content="no" />

	<!-- css -->
	<link href='http://fonts.googleapis.com/css?family=Roboto:500,300,700,400' rel='stylesheet' type='text/css'>
	<link rel="stylesheet" href="fonts/zmdi/css/material-design-iconic-font.min.css">
	<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/angular_material/0.9.0/angular-material.min.css">
	<link href="css/materialize.css" rel="stylesheet" />
	<link href="css/flexboxgrid.min.css" rel="stylesheet" />
	<link href="css/jquery-ui.css" rel="stylesheet" />
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
				<input label="Password" type="password"></paper-input>
			</form>
			
			<div class="block">
				<button class="btn" ng-click="logOff()">sair</button>
				<button class="btn btn-raised" ng-click="logConfirm()">confirmar</button>
			</div>
		</div>
		<div class="center off min">

			<!-- <img class="logo" src="icons/logo.fw.png" /> -->
			<h5>Clique para fazer login</h5>

			<img alt="" class="userPhoto">

			<form action="" class="form">
				<input label="Username" id="username" ng-model="uname"></input>
			</form>

			<div class="part2 hide">
				<span class="userName">{{uname}}</span>

				<form action="" class="form">
					<input label="Password" type="password" ng-model="upass"></input>
				</form>

				<div class="block">
					<button ng-click="logOff()">sair</button>
					<button raised class="white" ng-click="logConfirm()">confirmar</button>
				</div>
			</div>

		</div>
	</div>

	<nav>
		<div class="nav-wrapper">
			<div class="searchForm" horizontal layout>
				<span flex ng-hide="ws < 640"></span>
				<input type="text" ng-model="fileSearch" placeholder="Pesquise por arquivos da pasta..." flex three ng-class="{min: ws < 640}" />
				<span flex>
					<paper-icon-button icon="close"></paper-icon-button>
				</span>
			</div>
	
			<button class="btn btn-flat" ng-click="toggleLeft()"><icon name="menu" ></icon></button>
			<!-- <icon ng-show="bcCurr < bc.length-1 && ws > 640 " name="arrow-forward" ng-click="bcForward()"></icon> -->
			<button class="btn btn-flat" ng-show="bc.length > 1 && ws > 640" ng-click="bcBack()">
				<icon name="arrow-back" ></icon>
			</button>

			<span class="breadcrumbs">{{breadcrumbs()}}</span>


			<button class="btn btn-flat" ng-show="ws > 640" ng-click='fullscreen($event)'><icon  name="fullscreen" ></icon></butotn>
			<button class="btn btn-flat" ng-click="changeView()" ng-show="ws > 640"><icon name="{{viewType}}"></icon></butotn>
			<button class="btn btn-flat"><icon name="search"></icon></butotn>
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

	<aside>
		<div class="tree">
		    <script type="text/ng-template" id="categoryTree"> 
		        <span class="before" ng-if="category.children.length" ng-click="toggleFolder($event)">‣</span>

				<div class="folder" ng-click="openFolder(category, $index);toggleFolder($event, true)" title="{{category.file_name}}">
					<icon name="folder"></icon>
					{{category.file_name}}
				</div>

		        <div class="sub-item" ng-if="category.children.length">
		            <div class="item" ng-repeat="category in category.children" ng-if="category.is_folder == 1" ng-include="'categoryTree'"></div>
		        </div>
		    </script>
	        <div class="item" ng-repeat="category in categories" ng-if="category.is_folder" ng-include="'categoryTree'"></div>
		</div>
	</aside>

	<div class="archive_viewer">
		<div class="shortcuts {{viewType}}">
			<div class="icon" data-id="{{file.id}}" data-index="{{$index}}" ng-repeat="file in currentFolder.children | filter: {file_name: fileSearch, deleted: 0} " title="{{file.file_name}}" on-last-repeat>
				<div class="content-container" ng-if="file.is_folder == 1" ng-dblclick="openFolder(file, $index, $event)" data-tap="true" layout horizontal>
					<!-- <button class="btn btn-flat toggle-check">
						<icon name="check" ng-click="EditMode.setState(true, $event)"></icon>
					</button> -->
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
	</div>

	<div class="upload_board">
		<div class="up-header">
			Central de uploads
			<div class="up-close" ng-click="closeUb($event)">&times;</div>
		</div>
		<paper-tabs selected="0">
		  <paper-tab>EM ANDAMENTO</paper-tab>
		  <paper-tab>ENVIAR</paper-tab>
		</paper-tabs>
		<core-pages selected="0">
		  <section id='upload-list'>
		  	<div class="up-body">
				<table class="table table-hover">
					<thead>
						<th>Nome do arquivo</th>
						<th>Progresso</th>
						<th>Opçoes</th>
					</thead>
					<tbody></tbody>
				</table>
			</div>
		  </section>
		  <section class="upload-container">
		  	<form method="post" enctype="multipart/form-data">
				<span class='alert'></span>
				<paper-button raised id="upButton">
					<span>Escolher</span>
					<input class="fileAttach" type="file" name="fileAttach">
				</paper-button>
				<paper-button ng-click="uploadFile($event)" raised>Enviar</paper-button>
            </form>
		  </section>
		</core-pages>
		
	</div>

<!-- 		<paper-action-dialog class="dialog" heading="Selecione uma pasta:" backdrop="true" vertical layout>
  <script type="text/ng-template" id="moveFolderTree">
        <span class="before" ng-if="item.children.length > 0" ng-click="toggleFolder($event)">‣</span>

		<div ng-if="item.is_folder == 1" class="folder" ng-click="toggleFolder($event, true); selectFolder(item.id);" title="{{item.file_name}}">
			<core-icon icon="folder"></core-icon>
			{{item.file_name}}
		</div>

		<span ng-hide="item.is_folder != 1"></span>

        <div class="sub-item" ng-if="item.children">
            <div class="item" ng-if="item.is_folder == 1" ng-repeat="item in item.children" data-id="{{item.id}}" ng-include="'moveFolderTree'"></div>
        </div>
    </script>
    <div class="tree" flex>
	        	<div class="item" ng-repeat="item in categories" data-id="{{item.id}}" ng-include="'moveFolderTree'"></div>
	        </div>
	        <paper-button raised affirmative>mover</paper-button>
	        <paper-button raised dismissive>cancelar</paper-button>
</paper-action-dialog> -->

		<div class="media_viewer">
			<div class="v-container" layout horizontal>
				<div class="v-body" flex nine>
					<div class="paper-button-menu">
						<paper-icon-button icon="info" ng-click="toggleViewer(null, false)"></paper-icon-button>
						<paper-icon-button icon="social:share" ng-click="toggleViewer(null, false)"></paper-icon-button>
						<paper-icon-button icon="file-download" ng-click="toggleViewer(null, false)"></paper-icon-button>
						<paper-icon-button icon="close" ng-click="toggleViewer(null, false)"></paper-icon-button>
					</div>
					<div class="align-middle"></div>
				</div>
			</div>
		</div>
		
		<div class="fab">
			<div ng-mouseleave="visible = false; hideTooltips()">
				<button class="button " ng-mouseenter="visible = true; showTooltips()" ng-class="{hover: visible}">
				   <core-icon class="icon first-icon" icon="add"></core-icon>
				   <core-icon class="icon second-icon" icon="close"></core-icon>
				</button>
				<content ng-class="{show: visible, hide: !visible}">
					<ul>
						<li>
							<paper-fab mini class="dark-gray" icon="social:share" data-toggle="tooltip" data-placement="left" title="Compartilhar pasta atual" ng-click="visible = false; hideTooltips()"></paper-fab>
						</li>
						<li>
							<paper-fab mini class="blue" icon="folder" data-toggle="tooltip" data-placement="left" title="Criar nova pasta" ng-click="createFolder(currentFolder); visible = false; hideTooltips()"></paper-fab>
						</li>
						<li>
							<paper-fab mini class="purple" icon="file-upload" data-toggle="tooltip" data-placement="left" title="Enviar arquivo"  ng-click="showUploadBoard(true); visible = false; hideTooltips()"></paper-fab>
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

    <div class="detail_viewer">
    	<div class="dv-close">
			<paper-icon-button icon="arrow-back" ng-click="closeDetails()"></paper-icon-button>
		</div>
		<pre>{{fileInfo}}</pre>
		<p><b>Criado em:</b> {{fileInfo.c_time}}</p>
		<p><b>Data de modificação:</b> {{fileInfo.m_time}}</p>
		<p><b>Ultimo acesso:</b> {{fileInfo.a_time}}</p>
		<p><b>Tipo:</b> {{fileInfo.type}}</p>
		<p><b>Tamanho:</b> {{bytesToSize(fileInfo.size)}}</p>
    </div>

	<script src="js/jquery.js"></script>
	<script src="js/jquery-ui.js"></script>
	<script src="app/vendor/materializecss/js/index.js"></script>
	
	<script src="js/jquery.ui.touch-punch.min.js"></script>
	<!-- <script src="js/angular-min.js"></script> -->
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular-aria.min.js"></script>

    <script src="https://ajax.googleapis.com/ajax/libs/angular_material/0.9.0/angular-material.min.js"></script>
	<script src="js/app.js"></script>

    <script src="app/directives/autogrow.js"></script>
    <script src="app/directives/btn-class.js"></script>
    <script src="app/directives/icon.js"></script>
	</body>
</html>