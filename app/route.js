(function() {
    'use strict';

    angular
        .module('App.Routes', [
        	'ngRoute',
        	'oc.lazyLoad',
          'App.lazyloadConfig'
        ]);
})();

(function() {
    'use strict';

    angular
        .module('App.Routes')
        .provider('RouteHelpers', RouteHelpersProvider);

    RouteHelpersProvider.$inject = ['APP_REQUIRES'];
    function RouteHelpersProvider(APP_REQUIRES) {

      /* jshint validthis:true */
      return {
        // provider access level
        basepath: basepath,
        resolveFor: resolveFor,
        // controller access level
        $get: function() {
          return {
            basepath: basepath,
            resolveFor: resolveFor
          };
        }
      };

      // Set here the base of the relative path
      // for all app views
      function basepath(uri) {
        return 'app/views/' + uri;
      }

      // Generates a resolve object by passing script names
      // previously configured in constant.APP_REQUIRES
      function resolveFor() {
        var _args = arguments;
        return {
          deps: ['$ocLazyLoad','$q', function ($ocLL, $q) {
            // Creates a promise chain for each argument
            var promise = $q.when(1); // empty promise
            for(var i=0, len=_args.length; i < len; i ++){
              promise = andThen(_args[i]);
            }
            return promise;

            // creates promise to chain dynamically
            function andThen(_arg) {
              // also support a function that returns a promise
              if(typeof _arg === 'function')
                  return promise.then(_arg);
              else
                  return promise.then(function() {
                    // if is a module, pass the name. If not, pass the array
                    var whatToLoad = getRequired(_arg);
                    // simple error check
                    if(!whatToLoad) return $.error('Route resolve: Bad resource name [' + _arg + ']');
                    // finally, return a promise
                    return $ocLL.load( whatToLoad );
                  });
            }
            // check and returns required data
            // analyze module items with the form [name: '', files: []]
            // and also simple array of script files (for not angular js)
            function getRequired(name) {
              if (APP_REQUIRES.modules)
                  for(var m in APP_REQUIRES.modules)
                      if(APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name)
                          return APP_REQUIRES.modules[m];
              return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];
            }

          }]};
      } // resolveFor

    }
})();

(function () {

	'use strict';

	angular
		.module("App.Routes")
		.config(routesConfig);

	routesConfig.$inject = ['$routeProvider', 'RouteHelpersProvider', 'USER_TYPES'];
    function routesConfig($routeProvider, helper, USER_TYPES) {

		$routeProvider
			.when('/escolher-modulo', {
				templateUrl: "app/templates/escolher-modulo.html",
				controller: "ChooseModule"
			})

			.when('/login', {
				templateUrl: "app/templates/login.html",
				controller: "Login"
			})

			.when('/arquivos/escolher-empresa', {
				templateUrl: "app/templates/arquivos/escolher-empresa.html",
				controller: "ChooseCompany"
			})

			.when('/arquivos/explorar/empresa/:cnpj', {
				templateUrl: "app/templates/arquivos/listar-departamentos.html",
				controller: "Explorer",

				resolve: {
					DepartamentosQuery: function (Database) {
						return Database.getDepartamentos();
					}
				}
			})

			.when('/arquivos/explorar/empresa/:cnpj/:departamento', {
				templateUrl: "app/templates/arquivos/listar-tipos-de-docs.html",
				controller: "ExplorerDepartamentos",

				resolve: {
					DocTypeQuery: function (Database, $route) {
						var param = $route.current.params;

						return Database.getDocType({departamento: param.departamento});
					}
				}
			})

			.when('/arquivos/explorar/empresa/:cnpj/:departamento/:tipo', {
				templateUrl: "app/templates/arquivos/listar-documentos.html",
				controller: "ExplorerTDA",

				resolve: {
					DocsQuery: function (Database, $route) {
						var param = $route.current.params;

						return Database.getDocs({departamento: param.departamento, tipoDeArquivo: param.tipo});
					},

					TipoDeArquivoQuery: function (Database, $route) {
						var param = $route.current.params;

						return Database.getDocType({departamento: param.departamento});
					}
				}
			})

			.when('/arquivos/resultado-pesquisa', {
				templateUrl: "app/templates/arquivos/listar-documentos.html",
				controller: "SearchResult"
			})

			.when('/tarefas', {
				templateUrl: "app/modules/nevernotes/app/templates/home.html",
				controller: "App.Nevernotes.MainController",

				resolve: helper.resolveFor('quill', 'ngQuill', 'App.Nevernotes')
			})

      .when('/arquivos/certidoes', {
        templateUrl: "app/templates/arquivos/certidoes.html",
        controller: "App.Arquivos.Certidoes",
        allowTo: USER_TYPES["INTERNO"],

        resolve: {
          CertidoesQuery: function (Database) {
            return Database.checarValidadeDeTodasAsCertidoes();
          }
        }
      })

			.when('/redirect/:redirect*', {
				templateUrl: "app/templates/login.html",
				controller: "Login"
			})

			.otherwise({redirectTo: '/escolher-modulo'});
		};
})();