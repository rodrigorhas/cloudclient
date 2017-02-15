var app = angular.module('App', [
    'App.Core', 'App.Routes', 'App.Constants'
]);

app.directive('onLastRepeat', function ($timeout) {
	return function(scope, element, attrs) {
		if (scope.$last) $timeout(function() {
			scope.$emit('onRepeatLast', element, attrs);
		});
	};
});

app.controller('mainController', function(
	$scope, $http, $filter, $timeout,
	$mdSidenav, $mdUtil, $log, $compile,
	$mdBottomSheet, LoginService, $store,
	$window, $rootScope, $routeParams, $location,
    Database, USER_TYPES, $helper, $route) {

    scope = $scope;
    rootScope = $rootScope;

    // Bindings

    $rootScope.safe = $helper.safe;

    // Modules

    $rootScope.modules = [
        {
            name: "Arquivar Documentos",
            link: "#/arquivos/escolher-empresa",
            icon: "file"
        },

        {
            name: "Agendar Tarefas",
            link: "#/tarefas/inbox",
            icon: "calendar-note",
            disabled: false
        }
    ];

    // SideNav helpers

    $rootScope.toggleMenu = function () {
        $mdSidenav('left').toggle();
    }

    //TOAST BUTTON HACK

    $(document).on('click', '#toast-container .toast', function() {
        $(this).fadeOut(function(){
            $(this).remove();
        });
    });

    $scope.USER_TYPES = USER_TYPES;

    $rootScope.AllowTo = function (types) {
        var user = $rootScope.user;

        if(!user) {
            //console.info('[ALLOWTO] :: Missing user object, got ', typeof user );
            return false;
        }

        if(!types.length) types = [types];
        return $.inArray(parseInt(user.type, 10), types) > -1;
    }

    Database
        .Arquivos
		.getDepartamentos()
		.then(function (response) {
			$timeout(function () {
				$rootScope.departamentos = response.data;
			})
		})

	$rootScope.initializeComponents = function () {
		$timeout(function () {
			$(".modal").modal();
			$('select').material_select();
			$('[data-tooltip]').tooltip({position: 'left', delay: 50});
		});
	}

	var device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

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

    $rootScope.currentFolder = [];
    $scope.visible = false;

    $(function (){

    	$.fn.disableSelection = function() {
    		return this
    		.attr('unselectable', 'on')
    		.css('user-select', 'none')
    		.on('selectstart', false);
    	};

    	$scope.SearchForm = {
    		active: false,

    		departamentos: $rootScope.departamentos,
    		tipos_de_arquivos: [],

    		search: function () {
    			var self = this,
                    request = angular.copy(self.form);

                if(request.vencimento)
                    request.vencimento = $helper.normalDateToPhp(request.vencimento);

    			Database
                    .search(request)
                    .then(function (response) {
                        $timeout(function () {
                            $location.path("/arquivos/resultado-pesquisa");

                            if(response.data.length)
                                $rootScope.currentFolder = response.data;
                            else
                                $rootScope.currentFolder = [];
                        });
                    });
    		},

    		getTiposDeArquivos: function (item) {
    			var self = this;

    			$http
    			.get("ajax/get.php?module=getTipoDeArquivos&departamento=" + item.id)
    			.success(function(response) {
    				$timeout(function() { self.tipos_de_arquivos = response.data; });
    			});
    		},

    		form: {
    			mes: null,
    			ano: 2016,

    			departamento: null,
    			tipoDeArquivo: null,

                pesquisa: 1
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

    	$scope.returnCurrentFolderObj = function (id) {
    		for (var i = 0; i < $rootScope.currentFolder.length; i++) {
    			if($rootScope.currentFolder[i].id == id) {
    				return {obj: $rootScope.currentFolder[i], iteration: i};    				
    			}
    		};
    	}

    	$timeout(function () {
    		$rootScope.initializeComponents();
    	});

    	$rootScope.UploadBoard = {
    		form: {
    			type: null,
    			file_name: null,
    			year: parseInt(moment().format("YYYY"), 10),
    			month: parseInt(moment().format("M"), 10),
    			department: null,
    			obs: null
    		},

    		tipo_de_arquivos: [],

    		getTiposDeArquivos: function (item) {
    			var self = this;

                return Database
                          .getDocType({departamento: self.form.department})
                          .then(function (response) {
    				            $timeout(function() {
                                    self.tipo_de_arquivos = response.data;
                                });
                           });
    		},

    		reset: function () {
    			this.form = Object.create(this.rawForm);
    			this.tipo_de_arquivos = [];

    			$(".modal-upload").modal("close");
    		},

    		send: function () {

    			var self = this;

    			$timeout(function () {
    				var form = $(document.forms.namedItem("uploadForm")).find('.fileAttach');

    				var file = form[0].files[0];

                    if(self.fileInputName && self.fileInputName !== file.name) {
                        var fin = self.fileInputName;
                    }

    				var getPercentage = function (part, total){
    					return parseFloat(((part * 100) / total).toFixed(2));
    				}

    				function doUpload () {
    					var hash = Math.random().toString(32).substring(2);
    					var mes = (self.form.month < 10) ? "0" + self.form.month : self.form.month;
    					var vencimento = $helper.normalDateToPhp(angular.copy(self.form.vencimento));

                        var formData = new FormData();

                        formData.append('fileAttach', file);
    					formData.append("ano", self.form.year);
    					formData.append("mes", mes);
    					formData.append("vencimento", vencimento);
    					formData.append("tipo", self.form.type);
    					formData.append("departamento", self.form.department);
    					formData.append("observacao", self.form.obs);

                        if(fin) formData.append("nome", fin);

    					Database
        					.uploadFile(formData)
        					.then(function () {
        						$window.location.reload();
        					});
    				}

    				if(file.size <= 50 * 1000 * 1000) {
    					doUpload();
    				}

    				else
    					alert("Tamanho maximo de 50mb excedido");
    			});
    		}
    	}

    	$scope.UploadBoard.rawForm = Object.create($scope.UploadBoard.form);

    	$scope.downloadFile = function (hash) {
    		document.location = "ajax/get.php?module=getFile&hash=" + hash;
    	}

    	$scope.showFile = function (item) {
    		window.open(item.link, item.hash);
    	}

    	$rootScope.ContextMenu = {
    		dom: null,
    		id: null,
    		hash: null,
    		revert: true,
    		object: null,
    		threshold: 40,

    		create: function (e) {

    			var target = $(e.target);
    			target = (target.data("id")) ? target : (target.parents('tr').length) ? target.parents('tr') : target.parents('.icon');
    			var id = parseInt(target[0].dataset['id']);

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
    					var createListItem = function (name, command, target) {
    						return '<li class="list-item" '+ (target ? 'data-target="' + target + '"' : "") +' data-command="'+ command +'" ng-click="ContextMenu.chooseOption($event)"><span fit>' + name + '</span></li>'
    					}

    					var options = {
    						"doc.editar": createListItem("Editar", "doc.editar"),
    						"doc.abrir": createListItem("Abrir", "doc.abrir"),
    						"doc.renomear": createListItem("Renomear", "doc.renomear"),
    						"doc.mover": createListItem("Mover para...", "doc.mover"),
    						"doc.remover": createListItem("Remover", "doc.remover", "modal-file-prompt-remove"),
    						"doc.compartilhar": createListItem("Compartilhar", "doc.compartilhar"),
    						"doc.download": createListItem("Download", "doc.download"),
    						"doc.link": createListItem("Link", "doc.link"),
    						"doc.detalhes": createListItem("Detalhes", "doc.detalhes"),
    						"doc.favoritar": createListItem("Favoritar", "doc.favoritar"),
    						"docType.rename": createListItem("Editar nome", "docType.rename", "modal-doctype-prompt-rename"),
    						"docType.remove": createListItem("Remover", "docType.remove", "modal-doctype-prompt-remove"),
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

				if(!device) {
					if(self.dom) {
						self.dom.fadeOut(50, function (){
							self.dom.off();
							self.dom.remove();
						});
					}

					else $('.ContextMenu').fadeOut(50);
				}
			},

			chooseOption: function (e, object, option) {
				var self = this;
				var target = (e) ? $(e.target) : null;
				var obj = (object) ? object : self.object;
				var option;

				if(target) {
					if(device) {
						option = (target.is("button")) ? target.data("command") : target.parents('button').data("command");
						$mdBottomSheet.hide();
					}

					else {
						option = (target.is('span')) ? target.parents('li').data("command") : target.data("command");
						self.hide();
					}
				}

				if(!option) return;

	        	switch (option){ // SINGLE ACTION
	        		case "doc.abrir":
                    console.log(obj);
    	        		$scope.showFile(obj);
    	        		break;

	        		case "doc.remover":
                        $scope.FilePromptRemove.fill({
                            id: obj.id,
                            hash: obj.hash,
                            usuario: obj.usuario,
                            departamento: obj.departamento
                        });
    	        		break;

	        		case "doc.download":
    	        		$scope.downloadFile(obj.hash);
    	        		break;

	        		case "doc.editar":
	        	      	self.fn.editFile(angular.copy(obj));
	            		break;

	        		case "docType.rename":
                        $scope.DocTypeRenamePrompt.fill({nome: obj.file_name, id: obj.id});
	               		break;

	        		case "docType.remove":
                        $scope.DocTypeRemoveConfirm.fill({id: obj.id, isDefault: obj.isDefault});
    	        		break;

	        		default:
    	        		console.log("CONTEXTMENU :: OPÇÃO DESCONHECIDA :: " + option);
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
	        	});

	        	this.show(event);
	        },

	        fn: {
	        	editFile: function (object) {
        			$timeout(function () {

        				object.ano = parseInt(object.ano, 10);
        				object.mes = parseInt(object.mes, 10);

        				$scope.EditFile.fill(object);
        				$("#edit-file").modal("open");
        			});
        		}
        	}
        }

        $scope.deleteFromCurrentFolder = function (request) {
            return new Promise(function (resolve, reject) {
                for (var i = 0;  i < $rootScope.currentFolder.length; i++) {
                    var folderItem = $rootScope.currentFolder[i];

                    if(folderItem.id == request.id) {
                        $timeout(function () {
                            $rootScope.currentFolder.splice(i, 1);
                        });

                        return resolve();
                        break;
                    }
                }

                reject();
            })
        }

        $scope.FilePromptRemove = {
            data: {
                id: null,
                hash: null,
                usuario: null,
                departamento: null
            },

            fill: function (form) {
                var self = this;

                self.data = form;
            },

            send: function () {

                var self = this,
                    request = self.data;

                Database
                .deleteDoc(request)
                .then(function () {
                    return $scope.deleteFromCurrentFolder(request);
                })
                .then(function () {
                    $helper.toast("Registro removido...");
                    $("#modal-file-prompt-remove").modal("close");
                })
            }
        }

        $scope.DocTypeRenamePrompt = {
            form: {
                nome: null,
                id: null
            },

            fill: function (form) {
                var self = this;

                self.form = form;
            },

            send: function () {

                var self = this,
                    request = self.form;

                if(request.nome) {
                    Database
                        .renameDocType(request)
                        .then(function (response) {
                            for (var i = 0; i < $rootScope.currentFolder.length; i++) {
                                const index = i;
                                var item = $rootScope.currentFolder[i];

                                if(item.id == request.id) {
                                    $timeout(function () {
                                        $rootScope.currentFolder[index]['file_name'] = request.nome;
                                    });

                                    $helper.toast("Registro atualizado...");
                                    $("#modal-doctype-prompt-rename").modal("close");
                                }
                            }
                        })
                        .catch(function () {
                            $helper.toast("Ocorreu um erro");
                        });
                }

                else return $helper.toast("Preencha todos os campos...");
            }
        }

        $scope.DocTypeRemoveConfirm = {
            send: function () {
                var self = this,
                    request = self.item;

                Database
                    .removeDocType(request)
                    .then(function () {
                        return $scope.deleteFromCurrentFolder(request);
                    })
                    .then(function () {
                        $("#modal-doctype-prompt-remove").modal("close");
                        $helper.toast("Registro removido...");
                    })
            },

            fill: function (form) {
                var self = this;

                self.item = form;
            }
        }

        $scope.EditFile = {
        	form: {
        		mes: null,
        		ano: null,
        		nome: null,
        		obs: null
        	},

            fill: function (form) {
                var self = this;


                if(form.vencimento) {
                    form.vencimento = $filter("date")(form.vencimento, "dd/MM/yyyy");
                }

                self.form = form;
            },

        	send: function () {
        		var self = this;
                var request = self.form;

                request.vencimento = $helper.normalDateToPhp(angular.copy(request.vencimento));

                Database
                    .editFile(request)
                    .then(function () {

                        $helper.toast("Registro atualizado...");

                        for (var i = 0; i < $rootScope.currentFolder.length; i++) {
                            if($rootScope.currentFolder[i].hash == self.form.hash) {
                                var index = i;

                                $timeout(function () {
                                    $rootScope.currentFolder[index].nome = request.nome;
                                    $rootScope.currentFolder[index].ano = request.ano;
                                    $rootScope.currentFolder[index].mes = request.mes;
                                    $rootScope.currentFolder[index].obs = request.obs;
                                    $rootScope.currentFolder[index].vencimento = request.vencimento;
                                });
                            }
                        }
                    });
        	}
        }

	    $rootScope.refreshEmpresaDetails = function (params) {
            return new Promise (function (resolve, reject) {
    	    	if(!$rootScope.empresa && !$rootScope.redAjax) {

                    $rootScope.redAjax = true;

    	    		$.ajax({
    	    			url: "ajax/get.php?module=getEmpresaInfo",
    	    			method: "GET",
    	    			data: {cnpj: params.cnpj}
    	    		})
    	    		.success(function (response) {
    	    			response = JSON.parse(response);

    	    			if(response.success) {
    	    				$rootScope.empresa = response.data;
                            resolve(response.data);
    	    			}

    	    			else {
    	    				$location.path("/escolher-empresa");
                            reject();
    	    			}

    	    		});
    	    	}
            });
	    }

	    $scope.$on('$routeChangeStart', routeChangeHandler);

	    function routeChangeHandler (event, next, current) {
            var args = arguments;

            $timeout(function () {

                if($location.path().indexOf("/redirect") == 0) return;

                if(!$rootScope.user) {
                    LoginService.isAuth()
                        .then(function (response) {
                            $rootScope.user = response.user;

                            check.apply(check, args);
                        })
                        .catch(function () {
                            if(event) event.preventDefault();
                            $helper.path("/redirect" + $location.path());
                            $helper.toast("Faça login para continuar...");
                        });
                }

                else check.apply(check, args);
            }); 

            function check (event, next, current) {
                if(!event) {
                    var $current = {
                        name: $route.current.$$route.originalPath,
                        pass: true
                    };

                    $current.route = $route.routes[$current.name];

                    if($current.route && $current.route.allowTo) {
                        $current.pass = $rootScope.AllowTo($current.route.allowTo);
                    }

                    if($current.pass == false) {
                        $helper.path('/login');
                        return;
                    }
                }

                if(event && next.allowTo) {
                    console.log($rootScope.AllowTo(next.allowTo));
                    debugger;
                    if($rootScope.AllowTo(next.allowTo) == false) {
                        event.preventDefault();
                        $helper.toast("Você não tem acesso a essa área...");
                    }
                }

                $rootScope.ContextMenu.hide();
                $helper.closeToast();
            }
        }

	    routeChangeHandler();
	});
});
