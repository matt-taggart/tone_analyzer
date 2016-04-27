angular.module('toneAnalyzer')
  .controller('loginController', function($scope, $http, $window, $location, $timeout, $rootScope) {
    $scope.register = function() {
      $http({
        method: 'POST',
        url: '/register',
        data: $scope.registration,
        ignoreLoadingBar: true
      }).then(function(result) {
        if (result.data === 'success') {
          $scope.registerSuccess = result.data;
          $scope.registrationError = "";
          $timeout(function () {
            $location.path('welcome');
          }, 2200);
        } else {
          if (result.data.message.username) {
            var userLengthError = result.data.message.username.message;
            $scope.registrationError = userLengthError;
          } else if (result.data.message.password) {
            var passwordLengthError = result.data.message.password.message;
            $scope.registrationError = passwordLengthError;
          } else {
            var usernameError = result.data.message;
            $scope.registrationError = usernameError;
          }
        }
      });
    }

    $scope.login = function() {
      $http({
        method: 'POST',
        url: '/login',
        data: $scope.user,
        ignoreLoadingBar: true
      }).then(function(result) {
        if (!result.data.authenticated) {
          $scope.loginError = result.data.message;
        } else {
          $location.path('/welcome');
        }
      });
    }

    $scope.googleLogin = function() {
      $window.open('/auth/google', '_self');
    }

    $scope.showMainPage = function() {
      $window.open('/main_page', '_self');
    }

    $scope.logout = function() {
      $http({
        method: 'POST',
        url: '/logout',
        ignoreLoadingBar: true
      }).then(function(result) {
        $rootScope.isAuthenticated = result.data;
        $location.path('/welcome');
      });
    }

  });
