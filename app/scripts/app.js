'use strict';

angular.module('impactApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', { templateUrl: 'views/select_article.html',controller: 'MainCtrl'})
      .when('/article', { templateUrl: 'views/article.html',controller: 'MainCtrl'})
      .otherwise({ redirectTo: '/'});
  });
