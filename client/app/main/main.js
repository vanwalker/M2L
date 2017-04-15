'use strict';

angular.module('m2l')
  .config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/main/main.html',
            controller: 'MainCtrl'
        })
        // .when('/reservation', {
        //     templateUrl: 'components/resa/reservation.html',
        //     controller: 'ResaCtrl'
        // })
        // .when('/logs', {
        //     templateUrl: 'components/logs/logs.html',
        //     controller: 'LogCtrl'
        // })
        .when('/:category/:room', {
            templateUrl: function(param) {
                return 'components/salle/'+ param.category + '/' + param.room + '.html';
            },
            controller: 'SalleCtrl',
            authenticate: true
        });
  });