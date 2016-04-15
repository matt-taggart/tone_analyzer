angular.module('toneAnalyzer', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $provide) {
  $urlRouterProvider.otherwise('/welcome');

  //Check if the user is connected
  var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
    //Initialize a new promise
    var deferred = $q.defer();

    //Make an ajax call to check if user is logged in 
    $http({
      method: 'GET',
      url: '/loggedin'
    }).then(function(user) {
      if (user) {
        deferred.resolve();
      } else {
        deferred.reject();
        $location.path('login');
      }
    });

    return deferred.promise;
  }

  $provide.factory('localLogin', function($q, $location, $rootScope) {
    return {
      response: function(response) {
        if (typeof response.data === 'object') {
          if (response.data.googleName) {
            $rootScope.isAuthenticated = true;
            $rootScope.username = response.data.googleName;
          } else {
            $rootScope.isAuthenticated = true;
            $rootScope.username = response.data.firstname
          }
        }

        if (response.data === '0') {
          $rootScope.isAuthenticated = false;
        }
        return response;
      },
      responseError: function(response) {
        if (response.status === 401) {
          $location.url('/login');
        }
        return $q.reject(response);
      }
    }
  });


  $httpProvider.interceptors.push('localLogin');

  $stateProvider
    //Welcome Page
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'partials/welcome.html',
      controller: 'loginController',
      resolve: {
        loggedin: checkLoggedIn
      }
    })

    //Login Page
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login.html'
    })

    //Register Page
    .state('register', {
      url: '/register',
      templateUrl: 'partials/register.html'
    })

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });



});