/**
 * Created by jonathanleal on 2016-05-27.
 */
'use strict';

angular.module('m2l')
    .controller('ResaCtrl', function ($scope, $http, $rootScope,$routeParams) {

        $scope.awesomeThings = [];

        $http.get('/api/things').success(function(awesomeThings) {
            $scope.awesomeThings = awesomeThings;
        });

        //$scope.getCurrentUser = Auth.getCurrentUser;
       /* $scope.addThing = function() {
            if($scope.newThing === '') {
                return;
            }
            $http.post('/api/things', { name: $scope.newThing });
            $scope.newThing = '';
        };

        $scope.deleteThing = function(thing) {
            $http.delete('/api/things/' + thing._id);
        };*/
    });
