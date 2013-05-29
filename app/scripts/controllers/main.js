'use strict';

angular.module('impactApp')
  .controller('MainCtrl', function ($scope, $http) {

  	var artID = 172142;
  	var url = "http://dev-branch1.api.abcnyheter.no/v1/article/index.php?service=ABCNYHETER&scope=MYDESK_ARTICLE_BANK&id="+ artID +"&callback=JSON_CALLBACK";

    // var jsonpData = "";

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];


  //   $http({method: 'GET', url: '/someUrl'}).
	 //  success(function(data, status, headers, config) {
	 //    // this callback will be called asynchronously
	 //    // when the response is available
	 //  }).
	 //  error(function(data, status, headers, config) {
	 //    // called asynchronously if an error occurs
	 //    // or server returns response with an error status.
	 // });

    
	//  function jsonp_callback(data) {
	//     // returning from async callbacks is (generally) meaningless
	//     console.log("DATA: " +data.found);
	// }


	



	$http.jsonp(url).success(function(data, status, headers, config) {
        //what do I do here?
        // console.log("DATA: " + data);
  //       $scope.status = status;
  //       $scope.data = data;

  //       // obj = JSON.parse(data);

		// console.log(obj.count);

		 // $scope.data  = data.data;
		console.log(data.articles);

		$scope.author = data.articles[0].author;
 		$scope.byline = data.articles[0].byline;
 		$scope.article_content = data.articles[0].content; 
		$scope.article_date = data.articles[0].date;
		$scope.art_images = data.articles[0].images;
 		$scope.ingress = data.articles[0].ingress;
		$scope.art_title = data.articles[0].title;


         
    }).
    error(function(data, status, headers, config) {
        $scope.error = true;
        // console.log(data.data.articles);
    });




  });


function FetchCtrl($scope, $http, $templateCache) {
  $scope.method = 'GET';
  $scope.url = 'http-hello.html';
 
  $scope.fetch = function() {
    $scope.code = null;
    $scope.response = null;
 
    $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
      success(function(data, status) {
        $scope.status = status;
        $scope.data = data;
      }).
      error(function(data, status) {
        $scope.data = data || "Request failed";
        $scope.status = status;
    });
  };
 
  $scope.updateModel = function(method, url) {
    $scope.method = method;
    $scope.url = url;
  };
}