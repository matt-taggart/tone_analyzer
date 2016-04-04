angular.module('toneAnalyzer')
  .controller('loginController', function($scope, $http, $window, $location, $rootScope) {
    $scope.register = function() {
      $http({
        method: 'POST',
        url: '/register',
        data: $scope.registration
      }).then(function(result) {
        console.log(result.data);
      });
    }

    $scope.login = function() {
      $http({
        method: 'POST',
        url: '/login',
        data: $scope.user
      }).then(function(result) {
        if (result.data) {
          $rootScope.isAuthenticated = true;
          $rootScope.username = result.data.firstname;
          $location.path('welcome');
        } else {
          $rootScope.isAuthenticated = false;
        }
      });
    }

  });