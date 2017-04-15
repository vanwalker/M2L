'use strict';

angular.module('m2l')
  .controller('MainCtrl', function ($scope, $http, $rootScope) {
    $rootScope.awesomeThings = [];

//     $http.get('/api/things').success(function(awesomeThings) {
//       $rootScope.awesomeThings = awesomeThings;
//         console.log(awesomeThings);
//     }).error(function() {
// console.log("error");
//         });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
