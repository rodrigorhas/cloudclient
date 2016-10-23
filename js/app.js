var app = angular.module('App', ['ngMaterial']);

var scp;

app.directive('onLastRepeat', function() {
    return function(scope, element, attrs) {
        if (scope.$last) setTimeout(function(){
            scope.$emit('onRepeatLast', element, attrs);
        }, 1);
    };
});

app.controller('mainController', function($scope, $http, $filter, $timeout, $mdSidenav, $mdUtil, $log, $compile){

	scp = $scope;

	var tt = $('[data-toggle="tooltip"]');
	tt.tooltip({container: 'body',trigger: 'manual'});

	$scope.showTooltips = function (){
		if($('.tooltip')[0]) return;
		$timeout(function () { tt.tooltip('show')});
	}

	$scope.hideTooltips = function (){
		tt.tooltip('hide');
	}

	var tabs = document.querySelector('paper-tabs');
	var pages = document.querySelector('core-pages');

	
	var device;
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		device = true;
	}else{
		device = false;
	}

	if(tabs) {
		tabs.addEventListener('core-select',function(){
		  pages.selected = tabs.selected;
		});
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

	$scope.currentFolder = [];
	$scope.fileInfo = [];
	$scope.editModeArr = [];
	$scope.bc = [];
	$scope.bcCurr = 0;
	$scope.visible = false;
	$scope.bcName = "Home";
	
	$(function (){

		function setTapListener () {
			if(!device) return;
			var b = $('[data-tap="true"]');
			b.off();

			$scope.onRepeatLast(function (){
				b = $('[data-tap="true"]');
			    b.on("click", function(e) {
					if(!$('.editMode').hasClass('active')){
						var t = ($(e.target).data('id')) ? $(e.target) : $(e.target).parents('.icon');
						t = t.find('div');						
						t.dblclick();
					}else{
						e.preventDefault();
					}
				});		
	    	});
		}

		// CHECK USER SESSION

		(function () {
			$.ajax({
				url: 'ajax/get.php?module=checkUserSession',
				method: 'POST',
				success: function (data){
					if(data) {
						$timeout(function (){
							$('.loading').fadeOut(400, function(){
								$(this).remove();
							})
						});
						$scope.getTree();
					}else{
						$('.login').show();
					}
				}
			});
		})();

		$scope.ws = $(window).width();

		$(window).resize(function(e) {
			$scope.ws = $(this).width();
		});

		// LOGIN FUNCTIONS 

		$(document).on('ready', function (e){
			var l = $('.login');
			var ci = l.find('.center.in');
			var co = l.find('.center.off');
			var h = l.find('h5');
			var target = $(e.target);

			var i = co.find('[ng-model="uname"]');

			$timeout(function () {
				co.removeClass("off");
			}, 500);

			if(!ci.hasClass('min')){
				co.toggleClass('min');
			}

			else {
				co.toggleClass('min');

				if(co.find('input').val() != ""){
					co.find('img').addClass('show');
				}
			}

			$timeout(function(){
				i.focus();
			});
		});

		$scope.authUser = function (callback){

			var uname = $('[ng-model="uname"]');
			var upass = $('[ng-model="upass"]');

			$.ajax({
				url: 'ajax/get.php?module=authUser',
				method: 'POST',
				
				data: {u: uname.val() , p: upass.val() },
				success: function (data) {
					if(data != "404" && data != "1"){
						if(callback) callback();
					}else if (data == "404"){
						navigator.vibrate(100);
						console.log("Senha Invalida");
					}
				}
			});	
		}

		$scope.logConfirm = function (){
			var l = $('.login');
			var ld = $('.loading');
			var h = l.find('h5');
			var upass = $('[ng-model="upass"]');
			if(upass.val() != "" && upass.val() != undefined) {
				$scope.authUser(function (){
					h.hide();
					$timeout(function (){
						$scope.loginHide(function () {
							l.fadeOut(250);
							ld.fadeOut(250);
							$scope.getTree();
						}, true);
					})
				});
			}else {
				alert("Insira uma senha valida")
			}

		}

		$scope.loginHide = function (callback, opt){
			var l = $('.login');
			var ci = l.find('.center.in');
			var co = l.find('.center.off');
			var coimg = l.find('.center.off img');
			var p = l.find('paper-ripple');

			var un = ci.find('.userName');
			var up = ci.find('.userPhoto');

			un.addClass('delay');
			up.addClass('delay');

			p.removeClass('min').fadeToggle(500);
			ci.toggleClass('min');
			ci.fadeOut();
			co.toggleClass('min');
			coimg.removeClass('show');

			setTimeout(function (){
				un.removeClass('delay');
				up.removeClass('delay');
				if(callback) callback();
			}, 600);

		}

	    var typingTimer;                
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
	    });

	    $scope.doneTyping = function () {
	      $sb = usel.val();
	      if($sb !== "" && $sb !== undefined && $sb !== null){
	        $.ajax({
	        	url: 'ajax/get.php?module=getUserImg',
	        	method: 'POST',
	        	data: {u: $sb},
	        	success: function (data){
	        		if(data != "404"){
	        			$scope.userImg = data;
						localStorage.setItem('cc-u-p', data);
	        			var u = $('.userPhoto');
	        			u.attr('src', data);
	        			u.addClass('show');

	        			var l = $('.login');
						var ci = l.find('.center.in');
						var co = l.find('.center.off');
						var p = l.find('paper-ripple');
						var h = l.find('h5');
						var pt2 = co.find('.part2');
						
						pt2.removeClass('hide');
						pt2.find('paper-input').focus();

	        		}
	        	}
	        });
	        
	      }
	    };

	    $scope.emptySearchbar = function () {
	      usel.val('');
	    }

		function applyRowGrid () {
			$(".shortcuts.view-module").rowGrid({itemSelector: ".icon", minMargin: 36, maxMargin: 50, firstItemClass: "first-item"});
		}

		$scope.onRepeatLast = function (callback){
			$scope.$on('onRepeatLast', function(scope, element, attrs){
				callback();
			});
		}

		$scope.getTree = function (){

			$http.get('ajax/get.php?module=tree').success(function (data) {	    	
		    	$scope.categories = data;
		    	$scope.currentFolder = data[0];
		    	$scope.bc.push($scope.currentFolder);
		    	//setTapListener();
		    });
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
	    		$scope.createFolder($scope.currentFolder.id);
	    	}
	    });

		$scope.showUploadBoard = function (c) {

			var ub = $('.upload_board');
			tabs.selected = 1;
			pages.selected = 1;
    		ub.toggleClass('active');
    		
		}

	    $scope.openFolder = function (arr, index, e){	    	
	    	if(e !== undefined && $(e.target)[0].localName == 'paper-icon-button'){
	    		return false;
	    	}

	    	var cmenu = $('.cmenu');
	    	cmenu.fadeOut(150);

	    	$('.item, .icon, .shortcuts').disableSelection();
	    
	    	var d = $('.detail_viewer');
	    	var em = $('.editMode');

	    	if(em.hasClass('active')){
	    		return false;
	    	}else{

		    	if(d.hasClass('open')){
		    		d.removeClass('open');
		    	}

		    	if($scope.currentFolder == arr) return false;
		    	

		    	$timeout(function () {
		    		var exists = false;

			    	for (var i = 0; i < $scope.bc.length; i++) {
			    		var item = $scope.bc[i];
			    		if(item.id == arr.id) {
			    			exists = true;
			    			$scope.bc = $scope.bc.slice(0, i + 1);
			    		}
			    	}

		    		$scope.currentFolder = arr;
		    		if(!exists) $scope.bc.push($scope.currentFolder);
		    	});
	    	}
	    }	

	    $scope.showInfo = function (arr){
	    	$scope.$apply(function (){
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
    		for (var i = 0; i < $scope.currentFolder.children.length; i++) {
    			if($scope.currentFolder.children[i].id == id){    				
    				return {obj: $scope.currentFolder.children[i], iteration: i};    				
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
        		data: {pid: $scope.currentFolder.id},
        		success: function (data) {
        			data = JSON.parse(data);
        			data.children = [];
        			$scope.$apply(function (){
        				$scope.currentFolder.children.push(data);
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

		    	for (var i = 0; i < $scope.currentFolder.children.length; i++) {
	    			selectedFiles.push($scope.currentFolder.children[i].id);
	    			self.selection.push(i);
		    	};

		    	$('.icon').addClass('EditMode-checked');
         	},

         	deleteSelection: function () {
         		var self = this;

		    	for (var i = 0; i < $scope.selectedIcons.length; i++) {
	    			self.selection.push($scope.currentFolder.children[$scope.selectedIcons[i]].id);    			
		    	};

		    	for (var i = 0; i < self.selection.length; i++) { 
		    		for (var u = 0; u < $scope.currentFolder.children.length; u++) {
		    			if($scope.currentFolder.children[u].id == self.selection[i]){
		    				$scope.currentFolder.children.splice(u, 1);	
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

        $scope.bcBack = function (){
    		if ($scope.bc.length > 1){
    			$scope.bc.pop();
    			$scope.currentFolder = $scope.bc.slice(-1)[0];
    		}
        }

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

					    		for (var u = 0; u < $scope.currentFolder.children.length; u++) {

				    				if($scope.currentFolder.children[u].id == selectedFiles[i]){

				    					$scope.$apply(function (){			    						

				    						$scope.currentFolder.children[u].parent = $scope.destinationFolder;
				    						obj.children.push($scope.currentFolder.children[u]);
				    						$scope.currentFolder.children.splice(u,1);
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
	    			selectedFiles.push($scope.currentFolder.children[$scope.selectedIcons[i]].id);    			
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
        					me.css('height', '90%').css('width', '90%').css('max-width','100%').css('max-height','100%');
        				}else{
        					me.css('height', '90%').css('width', '90%').css('max-width','100%').css('max-height','100%');	
        				}
        			})
        				

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

        $scope.deleteFromStructure = function (id){
        	for (var i = 0; i < $scope.currentFolder.children.length; i++) {
    			if($scope.currentFolder.children[i].id == id){
    				$scope.$apply(function (){
    					$.ajax({
				    		url: 'ajax/get.php?module=trash',
				    		method: 'POST',
				    		data:{	    			
				    			ids : JSON.stringify([$scope.currentFolder.children[i].id]),
				    			deleted: 1
				    		},
				    		success: function(data){
				    			$('.editMode').removeClass('active');
				    			$scope.selectedIcons = [];
				    		}
				    	});
    					$scope.currentFolder.children.splice(i, 1);
    				});
    			}
    		};
    		
        }

        $scope.closeDetails = function (){
        	$('.detail_viewer').removeClass('opened');
        }

        $scope.uploadFile = function (e, hash) {
	        var parent = $(e.target).parents('.upload-container');
	        var body = $(e.target).parents('.fileinput');
	        var alert = body.find('.alert');
	        var form = parent.find('form');
	        var input = parent.find('.fileAttach');
	        var file = input[0].files[0];
	        var returnFileData = "";

	        var pid = $scope.currentFolder.id;
	         
	        function getPercentage (part, total){
	            return parseFloat(((part * 100) / total).toFixed(2));
	        }

	        function doUpload (pid, isRoot) {
				var formData = new FormData();                
				formData.append('fileAttach', file);

				var randNum = Math.floor((Math.random() * 1000) +1);

				var uplist = $('tbody');

				var tpl = "<tr>\
								<td>" + file.name + "</td>\
								<td>\
									<div class=\"progress\" id='upload_" + randNum + "''>\
										<div class=\"progress-bar\" style=\"width: 0%;\">\
									        <span class=\"sr-only\">0% Completo</span>\
									    </div>\
									</div>\
								</td>\
								<td>\
									<paper-button raised>CANCELAR</paper-button>\
								</td>\
							</tr>";

				$(uplist).append(tpl);

				pages.selected = 0;
				tabs.selected = 0;

				var isRoot = (isRoot == undefined) ? isRoot = "0" : isRoot = "1";

				$.ajax({
				    url: 'ajax/get.php?module=uploadFile&pid='+ ((pid) ? pid : -1) + '&ir=' +isRoot,
				    type: 'POST',
				    data: formData,
				    success: function (data) {                        
				        data = JSON.parse(data);
				        if(data){
				          $scope.returnFileData = data;
				          $scope.$apply(function (){
				          	$scope.currentFolder.children.push({
				          		id: data.id,
				          		file_name: file.name,
				          		parent: (pid) ? pid : -1,
				          		is_root: (isRoot) ? true : false,
				          		is_folder: 0,
				          		deleted: 0,
				          		children: [],
				          		file_type: file.type,
				          		file_hash: data.hash,
				          		info: data.info
				          	});
				      	  });

				        }
				    },
				    cache: false,
				    contentType: false,
				    processData: false,
				    xhr: function() {  // Custom XMLHttpRequest
				    	

				        var myXhr = $.ajaxSettings.xhr();
				        if (myXhr.upload) { // Avalia se tem suporte a propriedade upload
				            myXhr.upload.addEventListener('progress', function (e) {
				                var upload = $('#upload_' + randNum).find('.progress-bar');
				                upload.css('width', getPercentage(e.loaded, e.total) + "%");

				                if(e.loaded == e.total){
				                	uplist.find('#upload_' + randNum).parents('tr').find('paper-button').remove();   
				                	uplist.find('#upload_' + randNum).parents('tr').append('<li>x</li>');
				                	setTapListener();
				                }

				            }, false);
				        }
				    return myXhr;
				    }
				});
	        }

	        if(file.size <= 50000000 && pid != null){
	            body.find('.alert').html('Enviando...').show();
	            setTimeout(function(){ body.find('.alert').hide()}, 5000);

	            doUpload(pid);

	        }else{
	          	var alert = parent.find('.alert');
	            alert.toggleClass('warning');
	            if(pid != null){

	            	alert.html('Tamanho de arquivo excedido, máximo de 50mb').show();
	            	alert.click(function (){ alert.hide(); })
	            }else{
	            	//alert.html('Não é possivel enviar um arquivo para a raiz do disco').show();
	            	//alert.click(function (){ parent.find('.alert').hide(); })
	            	doUpload(pid, 1);
	            }
	            setTimeout(function(){ parent.find('.alert').hide()}, 5000);
            }
        }

        $scope.breadcrumbs = function () {
        	


        	var crumb = $scope.bc.reduce(function (crumb, item) {
        		return crumb += item.file_name + "/";
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
			targetDom: null,
			object: null,
			threshold: 40,

			create: function (e, target) {
				this.targetDom = target;
				this.id = target.data('id');

				var object = $scope.returnCurrentFolderObj(this.id).obj;
				this.object = object;
				this.hash = object.file_hash;

				//if(object.is_folder == 1) object.info = {menuOptions: null};

				var info = object.info;

				if(info.menuOptions){
					var defaultOptions = info.menuOptions;

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
						<div class="ContextMenu '+ (device ? "device" : "desktop") +'">\
							<div class="cm-overlay"></div>\
							<div class="cm-container down" draggable="'+ (device ? "true" : "false") +'">\
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
				var c = this.dom.find('.cm-container');
				var o = this.dom.find('.cm-overlay');

				if(device){
					c.addClass('down');
					o.fadeOut(400, function() {
						self.dom.hide();
						self.dom.off();
						self.dom.remove();
					});
				}else{
					self.dom.fadeOut(50, function (){
						self.dom.off();
						self.dom.remove();
					});
				}
			},

			chooseOption: function (e) {
				var self = this;
				var target = $(e.target);
				var option = target.data("command");
				var obj = self.object;

				self.hide();
		
	        	switch (option){ // SINGLE ACTION
	        		case "abrir":
	        			var types = ['.jpeg','.jpg','.gif','.png', '.jpeg','.bmp', '.mp4', '.3gp', '.wav', '.mp3'];
	  					var typeStr;

	        			var type = -1;

	        			if(obj.info.type){
		        			var t = obj.info.type;
		        			var nt = t.split(' ');
		        			typeStr = nt[1];
		        			type = types.indexOf(nt[0]);
	        			}else{
	        				console.log('this obj dont have info');
	        			}

		        		if(obj.is_folder == 1){
							$scope.openFolder(obj);
		    			}else if(obj.is_folder == 0 && type != -1){
		    				$scope.validFormat(obj);
		    			}

	        			break;

	    			case "remover":
						$scope.deleteFromStructure(self.id);
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
						$scope.downloadFile(self.hash);
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
        			break;
	        	}
			},

			setListeners: function (event) {

				var c = this.dom.find('.cm-container');
				var c_height = c.find('.cm-list').height() + 16;
				var o = this.dom.find('.cm-overlay');
				var wh = $(window).height();


				function getPercentage (e) {
					return wh * (e / 100);
				}

				var self = this;

				var threshold = this.threshold;

				o.on('click', function (){
					self.hide();
				});

				var dif = (wh - c_height);

				this.dif = dif;
				c.css('top', this.dif);
				
				if(device){
					c.draggable({
						axis: "y",
						cursor: "default",
						revert: function (){
							return self.revert;
						},

						start: function (){
							self.revert = true;
						},

						drag: function (e, ui){
							var pos = ui.position.top;

							if(pos < self.dif){
								ui.position.top = self.dif;
							}

							if(pos > getPercentage(threshold) ){
								self.revert = false;
							}
						},

						stop: function (e, ui){
							var pos = ui.position.top;

							if(pos > getPercentage(threshold)){
								self.revert = false;
								self.hide();
							}

							if(pos <= getPercentage(threshold)){
								self.revert = true;
							}
						}
					});	
				}

				self.dom.on('contextmenu', function(e){
					e.preventDefault();
					self.hide();
				});

				
				this.show(event);
			}
		}


		$('.shortcuts').on('contextmenu', '.icon', function(e){
			e.preventDefault();
			var target = $(e.target);
			var target = (target.data('id')) ? target : target.parents('.icon');
			$scope.ContextMenu.create(e, target);
		});

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