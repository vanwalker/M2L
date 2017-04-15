/**
 * Created by Jo on 16/06/2015.
 */
'use strict';

angular.module('m2l')
    .controller('SalleCtrl', function ($scope) {
        $scope.todaycalendrier =
        {
            url: 'components/salle/todaycalendar.html'
        };

        $scope.calendrier =
        {
            url: 'components/salle/calendar.html'
        };

        $scope.sheduler=
        {
            url: 'components/salle/sheduler.html'
        };

    });