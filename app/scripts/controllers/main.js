'use strict';

angular.module('impactApp')
  .controller('MainCtrl', function ($scope, $http, $location) {

	$scope.artID = 172142;

	
  	var leadImg = $('.lead-img');
  	window.onscroll = function(e){
  		leadImg.css({
  			top: window.pageYOffset/2 + 'px',
  			opacity: (leadImg.height() - window.pageYOffset)/leadImg.height()
  		})
  	}


 //  	$scope.fetch = function(){
	// 	var url = "http://dev-branch1.api.abcnyheter.no/v1/article/index.php?service=ABCNYHETER&scope=PUBLISHED_TODAY&id=172142&callback=JSON_CALLBACK";
 //  		console.log("URL " + url)
	// }


  })

.controller('ArticleCtrl', function ($scope, $routeParams, $http) {



		// // var artID = 142201;
		// var artID = 172142;
		// // var artID = 172125;

		console.log("TRY\n142201\n172142\n172125")
		console.log("Retrieving article with ID: "+$routeParams.artID)

		var leadImg = $('.lead-img');

  		window.onscroll = function(e){
	  		leadImg.css({
	  			top: window.pageYOffset/2 + 'px',
	  			opacity: (leadImg.height() - window.pageYOffset)/leadImg.height()
	  		})
  		}



  		var url = "http://dev-branch1.api.abcnyheter.no/v1/article/index.php?service=ABCNYHETER&scope=PUBLISHED_TODAY&id="+$routeParams.artID+"&callback=JSON_CALLBACK";
  			


		$http.jsonp(url).success(function(data, status, headers, config) {
				// console.log(data.articles[0]);

				$scope.Article = data.articles[0];


		         
		    }).
		    error(function(data, status, headers, config) {
		        $scope.error = true;
		    });




});
















