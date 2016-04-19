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
})
.controller('inputForm', function($scope, $http) {
  //Post content to be processed through API
    $scope.analyzeTone = function(){
      $http.post('/tonetext', {
        content: $scope.toneText,
        userId: $scope.firstname._id
      }).then(function(){
        $scope.toneText = '';
        $scope.retrieveDraft();
      });
    };
    $scope.renderDraftAndData = function(id){
      $http.get('/textdata/' + id).then(function(response){
        $scope.draftData = response.data
        $scope.idArray = [];
        angular.forEach($scope.draftData, function(value, key){
          $scope.value = value._id
          $scope.idArray.push({id: value._id, social_tone_data: value.social_tone_data, emotion_tone_data: value.emotion_tone_data, writing_tone_data: value.writing_tone_data})
          console.log($scope.idArray)
        })
      })
    }
    $scope.retrieveDraft = function(){
      $http.get('/drafts').then(function(response){
        $scope.drafts = response.data
        $scope.draftArray = [];
          angular.forEach($scope.drafts, function(value, key) {
            if (value.userId === $scope.firstname._id) {
              $scope.draftArray.push(value)
            }
          })
      })
    }
    $scope.retrieveUsername = function(){
      $http.get('/loggedin').then(function(response){
        $scope.firstname = response.data
      });
    }
  })
  .directive('drawChart', function() {
    //Render charts
    return {
      restrict: 'EA',
      templateUrl: '../template/chartRender.html',
      link: function (scope, element, attrs){

          var socialToneScore = [];
          var emotionToneScore = [];
          var writingToneScore = [];
          scope.toneScoreArray = [];
          
        
          angular.forEach(scope.idArray, function(value, key) {
            angular.forEach(value.social_tone_data, function(value, key){
              socialToneScore.push(value.tone_score)
            })
            angular.forEach(value.emotion_tone_data, function(value, key){
              emotionToneScore.push(value.tone_score)
            })
            angular.forEach(value.writing_tone_data, function(value, key){
              emotionToneScore.push(value.tone_score)
            })
          

          scope.toneScoreArray = socialToneScore.concat(emotionToneScore, writingToneScore)
          console.log(scope.toneScoreArray)

          $(element).highcharts({
            chart: {
              type: 'column'
            },
            title: {
                text: 'Tone Analysis'
            },
            xAxis: [{
                categories: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Emotional Range', 'Anger', 'Disgust', 'Fear', 'Joy', 'Sadness', 'Analytical', 'Confident', 'Tentative']
              }],
            yAxis: {
                title: {
                    text: 'Tone Score'
                }
            },
            series: [{
                data: scope.toneScoreArray,
              }],
            legend: {
              enabled: false
            }
          });
        })
    }
  }
});