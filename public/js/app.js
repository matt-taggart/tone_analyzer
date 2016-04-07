angular.module('toneAnalyzer', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('/welcome');

  $stateProvider
    //Welcome Page
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'partials/welcome.html'
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

    //Main Page
    .state('main_page', {
      url: '/main_page',
      templateUrl: 'views/main_page.html'
    })

  $locationProvider.html5Mode({
  enabled: true,
  requireBase: false
  });
});