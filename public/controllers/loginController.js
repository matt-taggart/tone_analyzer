angular.module('toneAnalyzer')
  .controller('loginController', function($scope, $http, $window, $location, $rootScope) {
    $scope.login = function() {
      $http({
        method: 'POST',
        url: '/login',
        data: $scope.user
      }).then(function(result) {
        console.log(result.data);
      });
    }

  });