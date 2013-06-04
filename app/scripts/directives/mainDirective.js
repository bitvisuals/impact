'use strict';

angular.module('impactApp')
  .directive('mainDirective', function () {
    
    // return {
    //   template: '<div></div>',
    //   restrict: 'E',
    //   link: function postLink(scope, element, attrs) {
    //     element.text('this is the mainDirective directive');
    //     angular.element('p').addClass('hide');

    //   }
    // };

    var newEl = "hello";
    console.log("Dir starts");

    var linkFn;
    linkFn = function( scope, element, attrs ) {
      // The next two lines duplicate the effect of the jQuery above.
      var newEl = angular.element( 'p' ).addClass( 'hide' );
       console.log("Dir starts");
      // angular.element( '.noscript' ).addClass( 'hide' );
    }

    return {
      restrict: 'E',
      link: linkFn
    }


  });






// var myModule = angular.module( 'myModule', [] );

// myModule.directive( 'myDirective', function() {
//   var linkFn;
//   linkFn = function( scope, element, attrs ) {

//     // The next two lines duplicate the effect of the jQuery above.
//     angular.element( 'iframe' ).removeClass( 'hide' );
//     angular.element( '.noscript' ).addClass( 'hide' );
//   }

//   return {
//     restrict: 'C',
//     link: linkFn
//   }
// })