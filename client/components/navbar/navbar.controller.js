'use strict';

angular.module('m2l')
  .controller('NavbarCtrl', function ($scope, $location, Auth, $rootScope, $http) {

      $scope.path = $location.path();
      $scope.path_infos = $location.path().split('/')[2];
      // SALLES INFOS
      $scope.salles = {
          infomedia : [
              {
                  area: 'Informatique - Multimédia',
                  'title': 'Multimédia',
                  url: '/infomedia/multimedia',
                  selected: false,
                  start: 7,
                  end: 23
              }
          ],
          reunion : [
              {
                  area: 'Salles de réunion',
                  'title': 'Daum',
                  url: '/reunion/daum',
                  selected: false,
                  start: 7,
                  end: 19
              },
              {
                  area: 'Salles de réunion',
                  'title': 'Corbin',
                  url: '/reunion/corbin',
                  selected: false,
                  start: 7,
                  end: 19
              },
              {
                  area: 'Salles de réunion',
                  'title': 'Baccarat',
                  url: '/reunion/baccarat',
                  selected: false,
                  start: 7,
                  end: 19
              },
              {
                  area: 'Salles de réunion',
                  'title': 'Longwy',
                  url: '/reunion/longwy',
                  selected: false,
                  start: 7,
                  end: 19
              },
              {
                  area: 'Salles de réunion',
                  'title': 'Lamour',
                  url: '/reunion/lamour',
                  selected: false,
                  start: 7,
                  end: 19
              },
              {
                  area: 'Salles de réunion',
                  'title': 'Grüber',
                  url: '/reunion/gruber',
                  selected: false,
                  start: 7,
                  end: 19
              },
              {
                  area: 'Salles de réunion',
                  'title': 'Majorelle',
                  url: '/reunion/majorelle',
                  selected: false,
                  start: 7,
                  end: 19
              },
              {
                  area: 'Salles de réunion',
                  'title': 'Gallé',
                  url: '/reunion/galle',
                  selected: false,
                  start: 7,
                  end: 19
              }
          ],
          reception : [
              {
                  area: 'Salles de réception',
                  'title': 'Amphithéatre',
                  url: '/reception/amphitheatre',
                  selected: false,
                  start: 7,
                  end: 19
              },
              {
                  area: 'Salles de réception',
                  'title': 'Salle de restauration',
                  url: '/reception/restauration',
                  selected: false,
                  start: 7,
                  end: 19
              },
              {
                  area: 'Salles de réception',
                  'title': 'Reprographie',
                  url: '/reception/reprographie',
                  selected: false,
                  start: 7,
                  end: 19
              },
              {
                  area: 'Salles de réception',
                  'title': "Hall d'acceuil",
                  url: '/reception/acceuil',
                  selected: false,
                  start: 7,
                  end: 19
              }
          ]
      };

      // DAYS INFOS
      $rootScope.days = [
          {
              day:'Yesterday',
              date: moment().subtract(1,'day').format("DD/MM/YYYY"),
              table: "yesterday"

          },
          {
              day:'Today',
              date: moment().format("DD/MM/YYYY"),
              table: "today"
          },
          {
              day:'Tomorrow',
              date: moment().add(1,'day').format("DD/MM/YYYY"),
              table: "tomorrow"
          }
      ];

      //HTTP GET CALL FOR RESERVATION
      $scope.getReservation = function(room, date, successCallback, errorCallback){
          var url = '/api/things/' + room + '/' + date + '/';
          console.log(url);
          $http({
              method: 'GET',
              url: url
          }).then(successCallback, errorCallback);
      };

      $scope.setReservation = function() {

          var url = '/api/things/' + $scope.path_infos,
              arrObj = [],
              dataObj = {
                  name: $scope.formDatas.name,
                  reservationStart: $scope.formDatas.reservationStart,
                  reservationEnd: $scope.formDatas.reservationEnd,
                  salle:'/' + $scope.path_infos,
                  roomEnd: $rootScope.roomEnd,
                  roomStart: $rootScope.roomStart
              };
          $http.post(url, dataObj);
          document.location.reload(true);

      };
      $scope.formDatas = {};

      $scope.roomTimeRange = function (){
          function rangeArray(a,b){
              var arr = [];
              if(a < b)
              {   a = b-a;
                  b = b-a;
                  a = a+b;
              }
              while(b <= a){
                  arr.push(b++);
              }
              return arr;
          }
          [$scope.salles.infomedia, $scope.salles.reunion, $scope.salles.reception].forEach(function (room) {
              var isFound = false;
              for (var item in room) {
                  if ($location.path() === room[item].url) {
                      $rootScope.roomStart = room[item].start;
                      $rootScope.roomEnd = room[item].end;
                      $rootScope.enabledHours = rangeArray($rootScope.roomStart,$rootScope.roomEnd);

                      isFound = true;
                  }
                  if(isFound)
                      break;
              }
              if (isFound)
                  return false;
          });
      };



      //CREATE TABLE YESTERDAY, TODAY, TOMORROW
      $scope.tableconstruct = function() {

          function toNumber(time) {
              time = time.split(' ')[1].split(':');
              return Number(time[0]) + (time[1] === '30' ? 0.5 : 0);
          }

          function inRange(hour, start, end) {
              return hour >= start && hour < end;
          }

          $scope.roomTimeRange();

          $rootScope.days.forEach(function(day){
              var i = $rootScope.roomStart;
              var $table = $('table.' + day.table);

              this.getReservation($scope.path_infos, day.date, function (response) {
                  console.log(response);
                  for (;i < $rootScope.roomEnd; i++){
                      $table
                          .append($("<tr><th>" + i + ' : 00 </th><td class="' + i + 'hour free"></td></tr>'));
                      $table
                          .append($("<tr><th>" + i + ' : 30 </th><td class="' + i + 'hour_5 free"></td></tr>'));
                      response.data.forEach(function (reservation) {
                          var start = toNumber(reservation.reservationStart);
                          var end = toNumber(reservation.reservationEnd);

                          if (inRange(i, start, end)) {
                              $table
                                  .find('td.' + i + "hour.free")
                                  .removeClass("free")
                                  .addClass("used")
                                  .text( reservation.name);
                          }

                          if (inRange(i + 0.5, start, end)) {
                              $table
                                  .find('td.' + i + "hour_5.free")
                                  .removeClass('free')
                                  .addClass('used')
                                  .text( reservation.name);
                          }
                      });
                  }
              },  function (response) {
                  console.log('error' + response);
              });
          }, this);
      };

      //CALENDAR CREATE WITH TODAY DATE
      $scope.todaycalendar = function(){
          $(function () {

              $('.datetimepicker').datetimepicker({format: 'DD/MM/YYYY',
                  daysOfWeekDisabled: [0, 6],
                  defaultDate: moment()

              }).on("dp.change", function() {
                  var todayDate = $(".datetimepicker").data("DateTimePicker").date().toString();
                  $rootScope.days[0].date = moment(todayDate).subtract(1,'day').format("DD/MM/YYYY");
                  $rootScope.days[1].date = moment(todayDate).format("DD/MM/YYYY");
                  $rootScope.days[2].date = moment(todayDate).add(1,'day').format("DD/MM/YYYY");
                  $scope.$apply();
                  $('tr').has('td.used').empty();
                  $('tr').has('td.free').empty();
                  $scope.tableconstruct();
              });
          });
      };

      //INPUT RESERVATION CALENDARS
      $scope.reservationpicker = function(){
console.log(moment());
          $('.datetimepicker6').datetimepicker({format: 'DD/MM/YYYY HH:mm',
              stepping: 30,
              // minDate: moment(),
              enabledHours: $rootScope.enabledHours
          });
          $('.datetimepicker7').datetimepicker({format: 'DD/MM/YYYY HH:mm',
              stepping: 30,
              enabledHours: $rootScope.enabledHours
          });
          $(".datetimepicker6").on("dp.change", function (e) {
              $('.datetimepicker7').data("DateTimePicker").minDate(e.date);
              $scope.formDatas.reservationStart = moment(e.date).format("DD/MM/YYYY HH:mm");
              $scope.$apply();
          });
          $(".datetimepicker7").on("dp.change", function (e) {

              $('.datetimepicker6').data("DateTimePicker").maxDate(e.date);

              $scope.formDatas.reservationEnd = moment(e.date).format("DD/MM/YYYY HH:mm");
              $scope.$apply();
          });
      };

      $scope.myVar = 0;

      /*$scope.deselectAll = function(scope) {
       for (var ind in $scope.scope) {
       $scope.scope[ind].selected = false;
       }
       };
       $scope.switchPage = function(a, scope) {
       for (var indice in $scope.scope) {
       if ($scope.scope[indice].selected)
       {$scope.myVar = a;}
       }
       };*/

      $scope.isCollapsed = true;
      $scope.isLoggedIn = Auth.isLoggedIn;
      $scope.isAdmin = Auth.isAdmin;
      $scope.getCurrentUser = Auth.getCurrentUser;

      $scope.logout = function() {
          Auth.logout();
          $location.path('/login');
      };

      $scope.isActive = function(route) {
          return route === $location.path();
      };
  });