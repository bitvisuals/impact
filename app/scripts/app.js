'use strict';

angular.module('impactApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', { templateUrl: 'views/select_article.html',controller: 'MainCtrl'})
      .when('/article/:artID', { templateUrl: 'views/article.html',controller: 'ArticleCtrl'})
      .otherwise({ redirectTo: '/'});
  });
