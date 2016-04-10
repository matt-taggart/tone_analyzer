angular.module('toneAnalyzer', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
  $urlRouterProvider.otherwise('/welcome');


  //Check if the user is connected
  var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
    //Initialize a new promise
    var deferred = $q.defer();

    //Make an ajax call to check if user is logged in 
    $http.get('/loggedin').success(function(user) {
      if (user !== '0') {
        console.log(user);
        deferred.resolve();
      } else {
        $rootScope.message = 'You need to log in';
        deferred.reject();
        $location.path('/login');
      }
    });

    return deferred.promise;
  }

  $httpProvider.interceptors.push(function($q, $location) {
    return {
      response: function(response) {
        console.log('hello');
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

  $stateProvider
    //The Welcome Cards are Displayed
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'partials/welcome.html',
      controller: 'loginController',
      resolve: {
        loggedin: checkLoggedIn
      }
    })

    //the login display
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login.html'
    })

    //the signup display
    .state('register', {
      url: '/register',
      templateUrl: 'partials/register.html'
    })


  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });



});