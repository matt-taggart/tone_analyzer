angular.module('hey', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/welcome');

  $stateProvider
    //The Welcome Cards are Displayed
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'partials/welcome.html'
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