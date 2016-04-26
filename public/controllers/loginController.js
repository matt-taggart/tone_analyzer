angular.module('toneAnalyzer')
  .controller('loginController', function($scope, $http, $window, $location, $rootScope) {
    $scope.register = function() {
      $http({
        method: 'POST',
        url: '/register',
        data: $scope.registration
      }).then(function(result) {
        if (result.data === 'success') {
          $location.path('/welcome');
          $scope.registerSuccess = result.data;
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
        data: $scope.user
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
        url: '/logout'
      }).then(function(result) {
        $rootScope.isAuthenticated = result.data;
        $location.path('/welcome');
      });
    }

  });
