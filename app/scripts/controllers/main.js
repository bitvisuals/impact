'use strict';

angular.module('impactApp')
  .controller('MainCtrl', function ($scope, $http, $location) {




  	var leadImg = $('.lead-img');
  	window.onscroll = function(e){
  		leadImg.css({
  			top: window.pageYOffset/2 + 'px',
  			opacity: (leadImg.height() - window.pageYOffset)/leadImg.height()



  		})
  	}



  	var articleID = "";

  	$scope.fetch = function(view){
  		

		console.log("Klikk " + $scope.artID + " " + view);
		
		
	  	var url = "http://dev-branch1.api.abcnyheter.no/v1/article/index.php?service=ABCNYHETER&scope=PUBLISHED_TODAY&id=142201&callback=JSON_CALLBACK";


  			
  		console.log("URL " +url)


		$http.jsonp(url).success(function(data, status, headers, config) {

				console.log("ARTICLES: "+data.articles);

				$scope.author = data.articles[0].author;
		 		$scope.byline = data.articles[0].byline;
		 		$scope.article_content = data.articles[0].content; 
				$scope.article_date = data.articles[0].date;
				$scope.art_images = data.articles[0].images[0].url;
		 		$scope.ingress = data.articles[0].ingress;
				$scope.art_title = data.articles[0].title;

				$location.path(view);
		         
		    }).
		    error(function(data, status, headers, config) {
		        $scope.error = true;
		    });
			

	}












		// var artID = 142201;
		// var artID = 172142;
		var artID = 172125;

		 var url = "http://dev-branch1.api.abcnyheter.no/v1/article/index.php?service=ABCNYHETER&scope=PUBLISHED_TODAY&id="+artID+"&callback=JSON_CALLBACK";

  			
  		console.log("URL " +url)


		$http.jsonp(url).success(function(data, status, headers, config) {
				console.log("ARTICLES: "+data.articles);

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
			























  });




