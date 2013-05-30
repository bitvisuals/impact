'use strict';

angular.module('impactApp')
  .controller('MainCtrl', function ($scope, $http, $location) {

	$scope.artID = 172142;

	// $scope.author = "";
	// $scope.byline = "";
	// $scope.article_content = ""; 
	// $scope.article_date = "";
	// $scope.art_images = "";
	// $scope.ingress = "";
	// $scope.art_title = "";

	// var url = "http://dev-branch1.api.abcnyheter.no/v1/article/index.php?service=ABCNYHETER&scope=PUBLISHED_TODAY&id=172142callback=JSON_CALLBACK";

  	var leadImg = $('.lead-img');
  	window.onscroll = function(e){
  		leadImg.css({
  			top: window.pageYOffset/2 + 'px',
  			opacity: (leadImg.height() - window.pageYOffset)/leadImg.height()
  		})
  	}



  	// var articleID = "";

  	$scope.fetch = function(){
  		

		// console.log("Klikk " + $scope.artID + " " + view);
		
		
	  	// return url = "http://dev-branch1.api.abcnyheter.no/v1/article/index.php?service=ABCNYHETER&scope=PUBLISHED_TODAY&id="+ $scope.artID+"&callback=JSON_CALLBACK";

		var url = "http://dev-branch1.api.abcnyheter.no/v1/article/index.php?service=ABCNYHETER&scope=PUBLISHED_TODAY&id=172142&callback=JSON_CALLBACK";

  			
  		console.log("URL " + url)
			

		// $http.jsonp(url).success(function(data, status) {

		// 		// console.log(data.articles[0]);
		// 		console.log(data, data.articles[0]);
		// 		console.log($scope.artID);

		// 		// return $scope.author = data.articles[0].author;
		//  	// 	return $scope.byline = data.articles[0].byline;
		//  	// 	return $scope.article_content = data.articles[0].content; 
		// 		// return $scope.article_date = data.articles[0].date;
		// 		// return $scope.art_images = data.articles[0].images[0].url;
		//  	// 	return $scope.ingress = data.articles[0].ingress;
		// 		// return $scope.art_title = data.articles[0].title;
		// 		$scope.content_rwo = data.articles[0];


		// 		// return data;
		// 		// $location.path(view);
		         
		//     }).
		//     error(function(data, status, headers, config) {
		//         $scope.error = true;
		//     });




				 // $scope.author = data.articles[0].author;
		 		//  $scope.byline = data.articles[0].byline;
		 		//  $scope.article_content = data.articles[0].content; 
				 // $scope.article_date = data.articles[0].date;
				 // $scope.art_images = data.articles[0].images[0].url;
		 		//  $scope.ingress = data.articles[0].ingress;
				 // $scope.art_title = data.articles[0].title;

			// $location.path(view);

	}












		// // var artID = 142201;
		// var artID = 172142;
		// // var artID = 172125;


		//  var url = "http://dev-branch1.api.abcnyheter.no/v1/article/index.php?service=ABCNYHETER&scope=PUBLISHED_TODAY&id="+$scope.artID+"&callback=JSON_CALLBACK";



		// 	var url = "http://dev-branch1.api.abcnyheter.no/v1/article/index.php?service=ABCNYHETER&scope=PUBLISHED_TODAY&id=172125&callback=JSON_CALLBACK";
  			


		// $http.jsonp(url).success(function(data, status, headers, config) {
		// 		console.log(data.articles[0]);

		// 		$scope.author = data.articles[0].author;
		//  		$scope.byline = data.articles[0].byline;
		//  		$scope.article_content = data.articles[0].content; 
		// 		$scope.article_date = data.articles[0].date;
				
		// 		//If img[0] else img[1]
		// 		$scope.art_images = data.articles[0].images[0].url;
		//  		$scope.ingress = data.articles[0].ingress;
		// 		$scope.art_title = data.articles[0].title;

		         
		//     }).
		//     error(function(data, status, headers, config) {
		//         $scope.error = true;
		//     });
			







		    
    // $.getJSON(url, function(json) {
        
    //     console.log(json, json.name);
    //     $scope.$apply(function(){
    //         $scope.page = json;
    //     });
    // });

    // $scope.getFbData = function() {
    //     return $scope.pageName;
    // };














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
				console.log(data.articles[0]);

				$scope.author = data.articles[0].author;
		 		$scope.byline = data.articles[0].byline;
		 		$scope.article_content = data.articles[0].content; 
				$scope.article_date = data.articles[0].date;
				
				//If img[0] else img[1]
				$scope.art_images = data.articles[0].images[0].url;
		 		$scope.ingress = data.articles[0].ingress;
				$scope.art_title = data.articles[0].title;

		         
		    }).
		    error(function(data, status, headers, config) {
		        $scope.error = true;
		    });



 //  	$scope.article = Article.get({artID: $routeParams.artID}, function(article) {

	// 		console.log(article[0])

 //   		$scope.mainImageUrl = article.images[0];
	// });




});
















