(function() {
    'use strict';

    angular.module('App.lazyloadConfig', []);

})();
(function() {
    'use strict';

    angular
        .module('App.lazyloadConfig')
        .config(lazyloadConfig);

    lazyloadConfig.$inject = ['$ocLazyLoadProvider', 'APP_REQUIRES'];
    function lazyloadConfig($ocLazyLoadProvider, APP_REQUIRES){

      // Lazy Load modules configuration
      $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: APP_REQUIRES.modules
      });

    }
})();
(function() {
    'use strict';

    angular
        .module('App.lazyloadConfig')
        .constant('APP_REQUIRES', {
            debug: true,
          // jQuery based and standalone scripts
          scripts: {
            'animate':            ['vendor/animate.css/animate.min.css'],

            'slimscroll':         ['vendor/slimScroll/jquery.slimscroll.min.js'],
            'screenfull':         ['vendor/screenfull/dist/screenfull.js'],

            'moment' :            ['vendor/moment/min/moment-with-locales.min.js'],

            "quill":               ["app/modules/nevernotes/app/vendors/quilljs/katex.min.css",
                                    "app/modules/nevernotes/app/vendors/quilljs/monokai-sublime.min.css",
                                    "app/modules/nevernotes/app/vendors/quilljs/quill.snow.css",
                                    "app/modules/nevernotes/app/vendors/quilljs/katex.min.js",
                                    "app/modules/nevernotes/app/vendors/quilljs/highlight.min.js",
                                    "app/modules/nevernotes/app/vendors/quilljs/quill.min.js"],
          },
          // Angular based script (use the right module name)
          modules: [
            {name: "ngQuill", files: ['app/modules/nevernotes/bower_components/ngQuill/src/ng-quill.js']},
            {name: "ui.materialize", files: ['app/modules/nevernotes/app/vendors/angular-materialize/angular-materialize.min.js']},
            {name: 'App.Nevernotes',            files: [
                                                        //"app/modules/nevernotes/app/vendors/bootstrap/dist/css/bootstrap.min.css",
                                                        "app/modules/nevernotes/app/css/style.css",

                                                        "app/modules/nevernotes/app/vendors/angular/angular-sanitize.js",
                                                        "app/modules/nevernotes/bower_components/ngstorage/ngStorage.min.js",
                                                        "app/modules/nevernotes/bower_components/ngtouch/build/ngTouch.min.js",
                                                        "app/modules/nevernotes/app/vendors/recorderjs/index.js",
                                                        "app/modules/nevernotes/app/vendors/bootstrap/dist/js/bootstrap.min.js",
                                                        "app/modules/nevernotes/app/vendors/waves/waves.min.js",
                                                        "app/modules/nevernotes/app/vendors/cursores/index.js",
                                                        "app/modules/nevernotes/app/vendors/auto-size/jquery.autosize.min.js",
                                                        "app/modules/nevernotes/app/vendors/nicescroll/jquery.nicescroll.min.js",
                                                        "app/modules/nevernotes/app/vendors/ngInfiniteScroll/index.js",
                                                        "app/modules/nevernotes/app/vendors/polyfills/Array.from.js",
                                                        "app/modules/nevernotes/app/js/app.js",
                                                        "app/modules/nevernotes/app/filters/orderObjectBy.js",
                                                        "app/modules/nevernotes/app/services/indexed-db.js",
                                                        "app/modules/nevernotes/app/services/store.js",
                                                        "app/modules/nevernotes/app/directives/bind-html-compile.js",
                                                        "app/modules/nevernotes/app/directives/btn-class.js",
                                                        "app/modules/nevernotes/app/directives/contenteditable.js",
                                                        "app/modules/nevernotes/app/directives/tagAutoComplete.js",
                                                        "app/modules/nevernotes/app/directives/task-list/task-list.js",
                                                        "app/modules/nevernotes/app/directives/task-viewer/task-viewer.js",
                                                        "app/modules/nevernotes/app/directives/icon.js",
                                                        "app/modules/nevernotes/app/directives/autogrow.js"]}

          ]
        })
        ;

})();
