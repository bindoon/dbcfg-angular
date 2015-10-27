'use strict';

/**
 * @ngdoc overview
 * @name dashboardApp
 * @description
 * # dashboardApp
 *
 * Main module of the application.
 */
angular
  .module('dbcfgApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'textAngular',
    'ui.bootstrap',
    'ui.tree'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dbcfg/:table', {
        templateUrl: 'views/dbcfg.html',
        controller: 'DbCfgCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/tree', {
        templateUrl: 'views/tree.html',
        controller: 'TreeCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
