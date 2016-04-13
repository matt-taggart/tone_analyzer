angular.module('toneAnalyzer')
  .controller('loginController', function($scope, $http, $window, $location, $rootScope) {
    $scope.register = function() {
      $http({
        method: 'POST',
        url: '/register',
        data: $scope.registration
      }).then(function(result) {
        $location.path('/welcome');
      });
    }

    $scope.login = function() {
      $http({
        method: 'POST',
        url: '/login',
        data: $scope.user
      }).then(function(result) {
        console.log(result);
        if (!result.data.authenticated) {
          $rootScope.error = result.data.message;
        } else {
          $location.path('/welcome');
        }
      });
    }

    $scope.googleLogin = function() {
      $window.open('/auth/google', '_self');
    }

    $scope.logout = function() {
      $http({
        method: 'POST',
        url: '/logout'
      }).then(function(result) {
        $rootScope.isAuthenticated = result.data;
        $location.path('/welcome');
      });
    }

  });