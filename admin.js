var chatbot = angular.module('chatbot', [
    // 'ngAnimate',
    'ui.router',
    'oc.lazyLoad',
    'LocalStorageModule',
    'ngSanitize',
    'ngPapaParse',
    'angularUtils.directives.dirPagination',
    'ngconfig',
    '720kb.datepicker',
    'ngTagsInput',
    'ui.select',
    'isteven-multi-select',
    'ngTagsInput',
    //'angularUtils.directives.dirPagination'
])
    .config(['localStorageServiceProvider', function (localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('webapp');
    }])

    .config(['$stateProvider', '$httpProvider', '$locationProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider',
        function ($stateProvider, $httpProvider, $locationProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider) {
            // $locationProvider.html5Mode(true);
            $urlRouterProvider.otherwise("/");
            //
            // Now set up the states
            $stateProvider
            .state('home', {
                    url: "/",
                    templateUrl: "./index.html",
                    controller: 'controller',
                    resolve: {
                        deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                files: [
                                    './controller.js'
                                ]
                            });
                        }]
                    }
                })
                         
        }])
    .config(function ($provide, $httpProvider, localStorageServiceProvider) {
        // Intercept http calls to add session token in the header.
        // this also checks for session expiry and log's out if session has expired
        $provide.factory('sessionInterceptor', function (localStorageService, $location) {
            return {
                request: function (config) {
                    var model = localStorageService.get('completeModel');
                    if (model != undefined) {
                        if (model != '') {
                            config.headers['x-access-token'] = model.accessToken;
                        }
                    }
                    return config;
                }
            };
        });
        // 403 interceptor
        $provide.factory('authInterceptorService', ['$q', '$location', '$rootScope', '$timeout', function ($q, $location, $rootScope, $timeout) {
            var responseError = function (rejection) {
                if (rejection.status === 403) {
                    // localStorageService.set({});
                    $location.path('login/expired');
                }
                else if(rejection.status === 500){
                    $rootScope.errorMessage = "Something went wrong. Try Again!!!"; 
                    $timeout(function () {
                        $rootScope.errorMessage = '';
                    }, 3000);
                    return $q.reject(rejection);
                }
                return $q.reject(rejection);
            };

            return {
                responseError: responseError
            };
        }]);
        // Add the interceptor to the $httpProvider.
        $httpProvider.interceptors.push('sessionInterceptor');
        $httpProvider.interceptors.push('authInterceptorService');

    });
