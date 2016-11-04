var app = angular.module('App', ['ngMaterial', 'ngRoute']);

app.directive('onLastRepeat', function ($timeout) {
	return function(scope, element, attrs) {
		if (scope.$last) $timeout(function() {
			scope.$emit('onRepeatLast', element, attrs);
		});
	};
});

app.controller('mainController', function($scope, $http, $filter, $timeout, $mdSidenav, $mdUtil, $log, $compile, $mdBottomSheet, $mdDialog, LoginService, $window, $rootScope){

	$scope.$on('$routeChangeStart', function(event, next) {
		LoginService.isAuth().then(function () {}, function () {
			event.preventDefault();
			$window.location.href = "#/login";
		})
	});

	scope = $scope;

	/*$http.get("ajax/get.php?module=getTipoDeArquivos").success(function(data) {
		$timeout(function() { $scope.all_file_types = data; });
	});*/

	function initializeComponents () {
		$timeout(function () {
			$(".modal-trigger").leanModal();
			$('select').material_select();
			$('[data-tooltip]').tooltip({position: 'left', delay: 50});
		});
	}

	var device;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		device = true;
	}else{
		device = false;
	}

	//fullscreen

	$scope.fullscreen = function(e){
		var target = $(e.target);
		var el = document.documentElement; // Make the body go full screen.
		function requestFS(){
			
		    var rfs = // for newer Webkit and Firefox
		    el.requestFullScreen
		    || el.webkitRequestFullScreen
		    || el.mozRequestFullScreen
		    || el.msRequestFullscreen
		    ;
		    if(typeof rfs!="undefined" && rfs){
		    	rfs.call(el);
		    } else if(typeof window.ActiveXObject!="undefined"){
			  // for Internet Explorer
			  var wscript = new ActiveXObject("WScript.Shell");
			  if (wscript!=null) {
			  	wscript.SendKeys("{F11}");
			  }
			}			
		}

		function cancelFS(){
			var el = document;
			var rfs = // for newer Webkit and Firefox
			el.cancelFullScreen
			|| el.webkitCancelFullScreen		        
			|| el.mozCancelFullScreen
			|| el.exitFullscreen
			;

            if (typeof rfs!="undefined" && rfs) { // cancel full screen.
            	rfs.call(el);
            } else if (typeof window.ActiveXObject!="undefined") { // Older IE.
            	var wscript = new ActiveXObject("WScript.Shell");
            	if (wscript != null) {
            		wscript.SendKeys("{F11}");
            	}
            }
        }

        var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||  (document.mozFullScreen || document.webkitIsFullScreen);
        
        if (isInFullScreen) {
        	cancelFS();
        	target.attr('icon', 'fullscreen');
        } else {
        	requestFS();
        	target.attr('icon', 'fullscreen-exit');
        }
    }

	//end fullscreen

	$rootScope.currentFolder = [];
	$rootScope.bc = [];
	$rootScope.bcCurr = 0;
	$scope.visible = false;
	$rootScope.bcName = "Home";
	
	$(function (){

		function setTapListener () {
			if(!device) return;
			$timeout(function () {
				var b = $('[data-tap="true"]');
				b.off();

				b.on("click", function(e) {
					if(!$('.editMode').hasClass('active')){
						var t = ($(e.target).data('id')) ? $(e.target) : $(e.target).parents('.icon');
						t = t.find('div');						
						t.dblclick();
					}

					else {
						e.preventDefault();
					}
				});
			})
		}

		$scope.ws = $(window).width();

		$(window).resize(function(e) {
			$scope.ws = $(this).width();
		});

		/*var typingTimer;                
		var doneTypingInterval = 1000;
		var usel = $('#username');
		var pssel = $('[ng-model="upass"');
		$scope.userImg = false;

		usel.keyup(function(){
			clearTimeout(typingTimer);
			typingTimer = setTimeout($scope.doneTyping, doneTypingInterval);
		});

		pssel.keydown(function(e){
			var key = e.keyCode || e.which;
			if(key == 13) $scope.logConfirm();
		});

		usel.keydown(function(e){
			var key = e.keyCode || e.which;
	   	//if(key == 9) e.preventDefault(); return;
	   	clearTimeout(typingTimer);
	   });*/

	   $scope.emptySearchbar = function () {
	   	usel.val('');
	   }

	   $.fn.disableSelection = function() {
	   	return this
	   	.attr('unselectable', 'on')
	   	.css('user-select', 'none')
	   	.on('selectstart', false);
	   };

	   $('body').disableSelection();

	   $scope.toggleFolder = function (e, opt){
	   	var self = $(e.target);

	   	if(self[0].localName !== "span"){
	   		var item = (self.parent().hasClass('open')) ? self.parent() : self.parents('.item');
	   		var tempIcon = item.parent().find('i[name="folder-outline"]');

	   		if(tempIcon.length) {
	   			tempIcon.attr('name', 'folder')
	   			item.parent().find('.open').removeClass('open')
	   		}

	   	}else{
	   		var item = self.parent();
	   	}

	   	var folder = item.find('.folder:first');
	   	var icon = folder.find('i:first');

	   	if(!item.hasClass('open') || opt == true){
	   		item.addClass('open');
	   		icon.parent().attr('name', 'folder-outline');
	   	}else{
	   		item.removeClass('open');
	   		icon.parent().attr('name', 'folder');
	   	}
	   };

	   $('[icon="search"], .searchForm [icon="close"]').on('click', function (){
	   	$('.searchForm').toggleClass('active');
	    	// limpa o campo de pesquisa
	    	$scope.$apply(function (){
	    		$scope.fileSearch = "";
	    	});
	    });

	   $(window).keydown(function(e) {
	   	var key = (e.which) ? e.which : e.keyCode;
	   	var sf = $('.searchForm');
	   	var input = sf.find('input');
	   	var ub = $('.upload_board');

	   	if(key == 27 && (sf.hasClass('active') || ub.hasClass('active'))){
	   		e.preventDefault();
	   		sf.removeClass('active');

	    		// refaz a funçao closeUb
	    		ub.removeClass('active');
	    		setTimeout(function (){
	    			$('.upload_board').hover(function () {
	    				ub.addClass('active');
	    				ub.off();
	    			});
	    		}, 1000);

	    		// limpa o campo de pesquisa
	    		$scope.$apply(function (){
	    			$scope.fileSearch = "";
	    		});

	    	}else if(e.ctrlKey && key == 70){
	    		e.preventDefault();
	    		if(!sf.hasClass('active')){
	    			sf.addClass('active');
	    			input.focus();
	    		}
	    	}else if (e.ctrlKey && key == 85 ){ // upload shortcut
	    		e.preventDefault();
	    		$scope.showUploadBoard();
	    	}else if (e.ctrlKey && e.altKey && key == 78){ //create new folder
	    		e.preventDefault();
	    		$scope.createFolder($rootScope.currentFolder.id);
	    	}
	    });

	   $scope.showUploadBoard = function (c) {

	   	var ub = $('.upload_board');
	   	ub.toggleClass('active');
	   }

	   $scope.SearchForm = {
	   	active: false,

	   	departamentos: $scope.departamentos,
	   	tipos_de_arquivos: [],

	   	search: function () {
	   		var self = this;

	   		console.log(self.form);

	   		$http({
	   			url: "ajax/get.php?module=getArquivos",
	   			method: "GET",
	   			params: self.form
	   		})
	   		.success(function (response) {
	   			$timeout(function () {

	   				var exists = false;

	   				for (var i = 0; i < $rootScope.bc.length; i++) {
	   					var bc = $rootScope.bc[i];
	   					if(bc.file_name == "Pesquisa") {
	   						exists = true;
	   						break;
	   					}
	   				}

	   				if(!exists) $rootScope.bc.push({file_name: "Pesquisa"});

	   				$rootScope.currentFolder = response;
	   			});
	   		});
	   	},

	   	getTiposDeArquivos: function (item) {
	   		console.log('write');
	   		var self = this;

	   		$http.get("ajax/get.php?module=getTipoDeArquivos&departamento=" + item.id).success(function(data) {
	   			$timeout(function() { self.tipos_de_arquivos = data; });
	   		});
	   	},

	   	form: {
	   		empresa: 1,

	   		mes: null,
	   		ano: 2016,

	   		departamento: null,
	   		tipo: null,

	   		usuario: null,
	   	},

	   	reset: function () {
	   		var self = this;

	   		self.form = Object.create($scope.SearchForm.rawForm);
	   		self.hide();
	   	},

	   	hide: function () {
	   		var self = this;

	   		self.active = false;
	   	},

	   	show: function (ev) {
	   		var self = this;

	   		self.active = true;

	   	}
	   }

	   $scope.SearchForm.rawForm = Object.create($scope.SearchForm.form);

	    $scope.showInfo = function (arr){
	    	$timeout(function (){
	    		$scope.fileInfo = arr.info;
	    	});
	    	var d = $('.detail_viewer');
	    	if(!d.hasClass('opened'))
	    		d.addClass('opened')
	    }

	    $scope.bytesToSize = function(bytes) {
	    	if(bytes == 0) return '0 Byte';
	    	var k = 1000;
	    	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	    	var i = Math.floor(Math.log(bytes) / Math.log(k));
	    	return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	    }

	    $scope.returnCurrentFolderObj = function (id) {
	    	for (var i = 0; i < $rootScope.currentFolder.length; i++) {
	    		if($rootScope.currentFolder[i].id == id) {
	    			return {obj: $rootScope.currentFolder[i], iteration: i};    				
	    		}
	    	};
	    }

	    $scope.rename = function (obj){
	    	var icon = $('.icon[data-id="'+obj.id+'"]');
	    	var p_val = icon.find('p').html();
	    	var p = icon.find('p');
	    	var parent = p.parent();
	    	var html = p.html();
	    	var rename = $('.rename');
	    	var filehash = (obj.file_hash) ? obj.file_hash : "";

	    	p.hide();
	    	rename.parent().find('p').show();
	    	rename.remove();
	    	p.parent().append('<textarea class="rename" type="text">'+html+'</textarea>');
	    	var textarea = parent.find('textarea');
	    	textarea.focus();
	    	textarea.keydown(function(e) {
	    		var key = e.keyCode || e.which;
	    		if(key == 13){
	    			textarea.trigger('focusout');
	    		}else if(e.ctrlKey && key == 65){
	    			textarea.select();
	    		}
	    	});

	    	parent.find('textarea').on( "focusout", function (){
	    		var r = $('.rename').val();
	    		p.html(r);
	    		obj.file_name = r;
	    		$('.rename').remove();
	    		p.show();
	    		if(textarea.val() == p_val) return;

	    		$.ajax({
	    			url: 'ajax/get.php?module=rename',
	    			method: 'POST',
	    			data: {
	    				newname: r,
	    				filehash: filehash,
	    				id: obj.id
	    			}
	    		});

	    	});
	    }

	    $scope.createFolder = function (id){
	    	$.ajax({
	    		url: 'ajax/get.php?module=newFolder',
	    		type: 'POST',
	    		data: {pid: $rootScope.currentFolder.id},
	    		success: function (data) {
	    			data = JSON.parse(data);
	    			$timeout(function (){
	    				$rootScope.currentFolder.children.push(data);
	    			});

	    			$scope.rename(data);
	    		}
	    	});

	    }


        /*
         *	EditMode
         */


         $scope.EditMode = {
         	active: false,

         	selection: [],

         	setState: function (state, e) {
         		var self = this;
         		var target = $(e.target);
         		var icon = target.parents('.icon');

         		icon.toggleClass('EditMode-checked');

         		self.active = state;

         		if(state == false) {
         			self.reset();
         			return;
         		}

         		var id = icon.data('id');
         		var obj = $scope.returnCurrentFolderObj(id).obj;

         		var index = icon.data('index');
         		var refIndex = self.selection.indexOf(index);

         		if(refIndex == -1)
         			self.selection.push(index);

         		else
         			self.selection.splice(refIndex, 1);        		

         		if(self.selection.length == 0){
         			self.setState(false, e);
         		}
         	},

         	getState: function () {
         		var self = this;

         		return self.active;
         	},

         	reset: function () {
         		var self = this;

         		self.selectedItems = [];

         		$timeout(function () {
         			$('.icon').removeClass('EditMode-checked');
         		});
         	},

         	selectAll: function () {
         		var self = this;

         		for (var i = 0; i < $rootScope.currentFolder.children.length; i++) {
         			selectedFiles.push($rootScope.currentFolder.children[i].id);
         			self.selection.push(i);
         		};

         		$('.icon').addClass('EditMode-checked');
         	},

         	deleteSelection: function () {
         		var self = this;

         		for (var i = 0; i < $scope.selectedIcons.length; i++) {
         			self.selection.push($rootScope.currentFolder.children[$scope.selectedIcons[i]].id);    			
         		};

         		for (var i = 0; i < self.selection.length; i++) { 
         			for (var u = 0; u < $rootScope.currentFolder.children.length; u++) {
         				if($rootScope.currentFolder.children[u].id == self.selection[i]){
         					$rootScope.currentFolder.children.splice(u, 1);	
         				}
         			};
         		};

         		$.ajax({
         			url: 'ajax/get.php?module=trash',
         			method: 'POST',
         			data:{	    			
         				ids : JSON.stringify(self.selection),
         				deleted: 1
         			},
         			success: function(data){
         				self.reset();
         			}
         		})
         	}
         }

         $timeout(function () {
         	initializeComponents();
         });

         $scope.UploadBoard = {
         	form: {
         		type: null,
         		file_name: null,
         		year: null,
         		month: null,
         		department: null,
         		obs: null
         	},

         	tipo_de_arquivos: [],

         	getTiposDeArquivos: function (item) {
         		console.log('write');
         		var self = this;

         		$http.get("ajax/get.php?module=getTipoDeArquivos&departamento=" + item.id).success(function(data) {
         			$timeout(function() { self.tipo_de_arquivos = data; });
         		});
         	},

         	inProgress: {},

         	updateInProgressItem: function (id, percentage) {
         		this.inProgress[id].progress = percentage;
         	},

         	addInProgressItem: function (item) {
         		this.inProgress[item.id] = item;
         	},

         	reset: function () {
         		this.form = Object.create(this.rawForm);
         		this.tipo_de_arquivos = [];

         		$("#modal-upload").closeModal();
         	},

         	send: function () {

         		var input = $("#modal-upload").find('.fileAttach');
         		var file = input[0].files[0];
         		var self = this;

         		var getPercentage = function (part, total){
         			return parseFloat(((part * 100) / total).toFixed(2));
         		}

         		function doUpload () {
         			var formData = new FormData();
         			formData.append('fileAttach', file);

         			var hash = Math.random().toString(32).substring(2);

         			var mes = (self.form.month < 10) ? "0" + self.form.month : self.form.month;

         			formData.append("ano", self.form.year);
         			formData.append("mes", mes);
         			formData.append("tipo", self.form.type);
         			formData.append("nome", self.form.file_name);
         			formData.append("departamento", self.form.department);
         			formData.append("observacao", self.form.obs);

         			console.log(self.form.obs);

         			var url = 'ajax/get.php?module=uploadFile';

         			self.addInProgressItem({id: hash, file_name: self.form.file_name, progress: 0});

         			$scope.showUploadBoard(true);

         			$('.tabs').tabs('select_tab', 'em_andamento');

         			$.ajax({
         				url: url,
         				type: 'POST',
         				data: formData,
         				success: function (data) {                        
         					console.log('arquivo enviado com sucesso');
         				},
         				cache: false,
         				contentType: false,
         				processData: false,
         				xhr: function() {

         					var myXhr = $.ajaxSettings.xhr();
         					if (myXhr.upload) {
         						myXhr.upload.addEventListener('progress', function (e) {
         							self.updateInProgressItem(hash, getPercentage(e.loaded, e.total));

         							if(e.loaded == e.total) {
         								console.log('Arquivo enviado completamente');
         								setTapListener();

         								self.reset();
         							}

         						}, false);
         					}
         					return myXhr;
         				}
         			});
         		}

         		if(file.size <= 50000000) {
         			doUpload();
         		}

         		else
         			alert("Tamanho maximo de 50mb excedido");
         	}
         }

         $scope.UploadBoard.rawForm = Object.create($scope.UploadBoard.form);

         $scope.destinationFolder = 0;
         $scope.selectFolder = function (id){
         	$scope.destinationFolder = id;
         }

         var resultChild;
         $scope.findInTree = function(node, search){
         	for(var i=0; i<node.children.length; i++){
         		if(node.children.length){					
         			$scope.findInTree(node.children[i], search);

         		}
         		if(node.children[i].id == search){
         			if(!resultChild){
         				resultChild = node.children[i];						
         			}

         		}
         	}
         	return resultChild;

         }

         $scope.moveToFolder = function (object){

         	function move (object, ids, error){
         		if(error > 0) 
         			return $log.debug('move function error: ' + error + ' errors');

        		// se o objeto for setado, set a var ids como um array com o id do objeto, para o stringify do ajax
        		if(object != null) {
        			ids = [object.id];
        		}

        		// se o id da pasta de destino for null, seta como vazio pro php setar como pasta root
        		$scope.destinationFolder = ($scope.destinationFolder == null) ? "" : $scope.destinationFolder;

        		$.ajax({
        			url: 'ajax/get.php?module=move',
        			method: 'POST',
        			data: {
        				ids: JSON.stringify(ids),
        				pid: $scope.destinationFolder
        			},
        			success: function (data){
        				var obj = $scope.findInTree($scope.categories[0], $scope.destinationFolder);
	        			// caso nao ache, ele volta undefined, e se o target for vazio
	        			// entao o destino é a pasta home, is_root tem que ser 1 para a pasta aparecer
	        			if($scope.destinationFolder == ""){ var obj = $scope.categories[0]}

	        				for (var i = 0; i < selectedFiles.length; i++) {

	        					for (var u = 0; u < $rootScope.currentFolder.children.length; u++) {

	        						if($rootScope.currentFolder.children[u].id == selectedFiles[i]){

	        							$scope.$apply(function (){			    						

	        								$rootScope.currentFolder.children[u].parent = $scope.destinationFolder;
	        								obj.children.push($rootScope.currentFolder.children[u]);
	        								$rootScope.currentFolder.children.splice(u,1);
	        							});
	        						}
	        					};
	        				};

	        				$('.editMode').removeClass('active');
	        			}
	        		});	
        	}

        	if(object != undefined){
        		move(object);

        	}else{
        		var selectedFiles = [];
        		for (var i = 0; i < $scope.selectedIcons.length; i++) {
        			selectedFiles.push($rootScope.currentFolder.children[$scope.selectedIcons[i]].id);    			
        		};

        		var error = 0;
        		for (var i = 0; i < selectedFiles.length; i++) {
        			if(selectedFiles[i] == $scope.destinationFolder){
        				error++;
        			}
        		};

        		move(null, selectedFiles, error);
        	}
        }

        $scope.returnTemplateByType = function (obj) {
        	var typeStr = obj.info.type;
        	var type, template;

        	if(typeStr.indexOf('video') > 0){
        		type = "video";
        	}else if(typeStr.indexOf('audio')  > 0){
        		type = "audio";
        	}else if(typeStr.indexOf('image')  > 0){
        		type = "image";
        	}

        	if(typeStr.indexOf('video') > 0){
        		template = "<video autoplay controls src='ajax/get.php?module=getFile&video=1&hash=" + obj.file_hash + "'></video>";
        	}else if(typeStr.indexOf('audio')  > 0){
        		template = "<audio autoplay controls src='ajax/get.php?module=getFile&hash=" + obj.file_hash + "'></audio>";
        	}else if(typeStr.indexOf('image')  > 0){
        		template = "<img src='ajax/get.php?module=getFile&hash="+ obj.file_hash +"'>";
        	}


        	return {type: type, template: template};
        }

        $scope.validFormat = function (obj) {
        	var result = $scope.returnTemplateByType(obj);
        	if(result.type != undefined && result.template != undefined){
        		$scope.toggleViewer(result, true);
        	}else{
        		// FAZER O DOWNLOAD
        		//$scope.downloadFile(obj.id);
        		console.log('download');
        	}
        }

        $scope.downloadFile = function (hash) {
        	document.location = "ajax/get.php?module=getFile&hash=" + hash;
        }

        $scope.showFile = function (hash) {
        	window.open('user_files/' + hash, hash);
        }

        $scope.toggleViewer = function (obj, condition){
        	var v = $('.media_viewer');
        	var am = $('.v-body').find('.align-middle');
        	var time = 300;    		
        	if(obj == null){

        		if(!v.hasClass('open') || condition) {
        			v.addClass('open');
        			v.fadeIn(time);
        		}else{
        			v.removeClass('open');
        			v.fadeOut(time, function (){
        				am.children().attr('src', '');
        				am.html("");
        			});
        		}
        	}else{

        		var template = obj.template;

        		if(!v.hasClass('open') || condition) {
        			am.html(template);

        			var child = am.children()[0];
        			if(child.volume){
        				// se for video ou audio, seta um valor padrao de volume
        				child.volume = 0.4;
        			}

        			
        			am.children().resize(function(){
        				var me = $(this);
        				if(me.height() > me.width()){
        					me.parent().css('height', '100%');
        				}

        				me.css({'height': '90%', 'width': '90%', 'max-width': '100%', 'max-height': '100%'});
        			});


        			v.addClass('open');
        			v.fadeIn(time);
        		}else{
        			v.removeClass('open');
        			v.fadeOut(time, function (){
        				am.children().attr('src', '');
        				am.html("");
        			});
        		}
        	}
        }

        $scope.deleteFromStructure = function (item) {

        	$.ajax({
        		url: 'ajax/get.php?module=trash',
        		method: 'POST',

        		data: {
        			ids : JSON.stringify([item.id]),
        			deleted: 1
        		},

        		success: function(data){

        			$timeout(function (){
        				$scope.selectedIcons = [];

        				for (var i = 0; i < $rootScope.currentFolder.children.length; i++) {
        					var folderItem = $rootScope.currentFolder.children[i];

        					if(folderItem.id == item.id) {
        						$rootScope.currentFolder.children.splice(i, 1);
        						break;
        					}
        				}
        			});

        			$('.editMode').removeClass('active');
        		}
        	});
        }

        $scope.closeDetails = function (){
        	$('.detail_viewer').removeClass('opened');
        }

        $scope.breadcrumbs = function () {

        	var crumb = $rootScope.bc.reduce(function (crumb, item) {
        		if(item) {
        			return crumb += item.file_name + "/";
        		}
        	}, "");


        	return crumb;
        }

        $scope.viewType = (!device) ? "view-module" : "view-list";

        $scope.changeView = function (){
        	var self = $(this);
        	var view = $('.shortcuts');

        	if($scope.viewType == "view-module"){
        		$scope.viewType = 'view-list';
        	}else{
        		$scope.viewType = 'view-module';
        	}

        }

        $scope.closeUb = function (e) {
        	$(e.target).parents('.upload_board').removeClass('active');
        }

        var dialog = $('paper-action-dialog');
        dialog.on('core-overlay-close-completed', function (){
        	$(this).attr('opened', false);
        });

        $scope.toggleDialog = function (condition, callback){
        	var o = dialog.attr('opened');

        	if(o == true){
        		dialog.attr('opened', false);
        	}else{
        		dialog.attr('opened', true);
        	}

        	if(callback){
        		callback();
        	}else{
        		$('[affirmative]').on('click', function (e){
        			$scope.moveToFolder();
        			$(this).off();
        		})
        	}

        }

        $scope.ContextMenu = {
        	dom: null,
        	id: null,
        	hash: null,
        	revert: true,
        	object: null,
        	threshold: 40,

        	create: function (e) {

        		var target = $(e.target);
        		target = (target.data("id")) ? target : target.parents('tr');
        		var id = target.data('id');

        		if(!id) return;

        		this.id = id;

        		var folderItem = $scope.returnCurrentFolderObj(this.id);

        		var object;

        		if(folderItem) {
        			object = folderItem.obj;
        		}

        		else return;

        		this.object = object;
        		this.hash = object.file_hash;

				var defaultOptions = object.menuOptions;

				console.log(defaultOptions);

				if(defaultOptions){
					
					if(device) {
						$mdBottomSheet.show({
							templateUrl: "app/templates/bottom-sheet.html",
							controller: function ($scope, items, object) {
								$scope.items = items;
								$scope.object = object;
							},

							locals: {
								items: defaultOptions,
								object: object
							}
						});
					}

					else {
						var createListItem = function (name, command) {
							return '<li class="list-item" data-command="'+ command +'" ng-click="ContextMenu.chooseOption($event)"><span fit>' + name + '</span></li>'
						}

						var options = {
							abrir: createListItem("Abrir", "abrir"),
							renomear: createListItem("Renomear", "renomear"),
							mover: createListItem("Mover para...", "mover"),
							remover: createListItem("Remover", "remover"),
							compartilhar: createListItem("Compartilhar", "compartilhar"),
							download: createListItem("Download", "download"),
							link: createListItem("Link", "link"),
							detalhes: createListItem("Detalhes", "detalhes"),
							favoritar: createListItem("Favoritar", "favoritar")
						};

						var optionsString = "";

						for (var i = 0; i < defaultOptions.length; i++) {
							if(options[defaultOptions[i]]) {
								optionsString += options[defaultOptions[i]];
							}
						};

						var template = '\
						<div class="ContextMenu desktop">\
						<div class="cm-overlay"></div>\
						<div class="cm-container down" draggable="false">\
						<ul class="cm-list">'+ optionsString +'</ul>\
						</div>\
						</div>\
						';

						template = $compile($(template))($scope);

						$(template).appendTo($('body'));

						this.dom = $('.ContextMenu');

						this.dom.data('isDevice', device);

						var self = this;
						$timeout(function (){
							self.setListeners(e);
						});
					}


				}else{
					return false;
				}
			},

			show: function (e) {
				var cmenu = this.dom;
				var c = cmenu.find('.cm-container');
				var o = cmenu.find('.cm-overlay');

				var self = this;
				
				if(device){
					cmenu.css('z-index', 19);
					c.css('top', this.dif);
					cmenu.show();

					o.fadeIn(250, function (){
						c.removeClass('down');
					});
				}else{

					var s = $('.shortcuts');
					var a = $('aside');
					var sw = s.width() + a.width();
					var sh = s.height();

					var cmenu = this.dom.find('.cm-list');
					var cw = cmenu.width();
					var ch = cmenu.children().length * 48;

					var x = e.pageX;
					var y = e.pageY;

					function calc (x, y) {
						if(ch >= 300) ch = 300;
						if(x + cw > sw){x = x - cw;}
						if(y + ch > sh ){y = y - ch;}
						return {x: x, y: y}
					}

					var fc = calc (x, y);

					c.css({top: fc.y, left: fc.x});
					c.fadeIn(150);
					//o.show();

				}
			},

			hide: function () {
				var self = this;

				if(!device){
					self.dom.fadeOut(50, function (){
						self.dom.off();
						self.dom.remove();
					});
				}
			},

			chooseOption: function (e, object) {
				var self = this;
				var target = $(e.target);
				var obj = (object) ? object : self.object;
				var option;

				if(device) {
					option = (target.is("button")) ? target.data("command") : target.parents('button').data("command");
					$mdBottomSheet.hide();
				}

				else {
					option = (target.is('span')) ? target.parents('li').data("command") : target.data("command");
					self.hide();
				}

	        	switch (option){ // SINGLE ACTION
	        		case "abrir":

	        		/*if(obj.is_folder == 1){
	        			$scope.openFolder(obj);
	        		}else if(obj.is_folder == 0){
	        			$scope.validFormat(obj);
	        		}*/

	        		$scope.showFile(obj.hash);

	        		break;

	        		case "remover":
	        		$scope.deleteFromStructure(obj);
	        		break;

	        		case "detalhes":
	        		if(obj.is_folder == 0 || obj.is_folder == 1){
	        			$scope.showInfo(obj);
	        		}
	        		break;

	        		case "renomear":

	        		$scope.rename(self.object);
	        		break;

	        		case "enviar_arquivo":
	        		tabs.selected = 1;
	        		pages.selected = 1;
	        		ub.addClass('active');
	        		break;

	        		case "nova_pasta":
	        		$scope.createFolder(self.id);
	        		break;

	        		case "download":
	        		$scope.downloadFile(obj.hash);
	        		break;

	        		case "mover":
	        		$scope.toggleDialog(null, function (){
	        			$('[affirmative]').on('click', function (e){
	        				e.preventDefault();
	        				$scope.moveToFolder(obj);
	        				$(this).off();
	        			})
	        		});
	        		break;

	        		default:
	        		console.log("opção desconhecido " + option);
	        		break;
	        	}
	        },

	        setListeners: function (event) {
	        	var self = this;

	        	self.dom.on('contextmenu', function(e){
	        		e.preventDefault();
	        		self.hide();
	        	});

	        	self.dom.find('.cm-overlay').on("click", function () {
	        		self.hide();
	        	})


	        	this.show(event);
	        }
	    }

		// DRAWER OR SIDENAV (AMD)
		$scope.toggleLeft = buildToggler('left');
		$scope.toggleRight = buildToggler('right');

		function buildToggler(navID) {
			var debounceFn =  $mdUtil.debounce(function(){
				$mdSidenav(navID)
				.toggle()
				.then(function () {
					$log.debug("toggle " + navID + " is done");
					$('content').addClass('opened');
					$('md-backdrop').on('click', function (){	
						$('content').removeClass('opened');
					});
				});
			},0);
			return debounceFn;
		}

		$scope.Sidenav = $mdSidenav('left');

	    // DRAWER FUNCTIONS
	    // load user photo
	    $scope.userImg = localStorage.getItem('cc-u-p');

	    var handler = $('md-sidenav').find('handler');
	    var sd = $('md-sidenav');
	});
});
