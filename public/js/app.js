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
    $scope.analyzeTone = function(){
      $http.post('/tonetext', {
        content: $scope.toneText
      }).then(function(){
        $scope.toneText = '';
        $scope.retrieveData();
      });
    };
    $scope.retrieveData = function(){
      $http.get('/calldata').then(function(response){
        $scope.toneDatas = response.data
        $scope.idArray = [];
        angular.forEach($scope.toneDatas, function(value, key) {
          $scope.value = value._id
          $scope.idArray.push({id: value._id, social_tone_data: value.social_tone_data, emotion_tone_data: value.emotion_tone_data, writing_tone_data: value.writing_tone_data})
        });
      });
    }
    $scope.retrieveDraft = function(){
      $http.get('/drafts').then(function(response){
        $scope.drafts = response.data
        console.log($scope.dra);
      });
    }
    $scope.retrieveDraft = function(){
      $http.get('/drafts').then(function(response){
        $scope.drafts = response.data
        console.log($scope.dra);
      });
    }
  })
  .directive('drawChart', function() {
    return {
      restrict: 'EA',
      templateUrl: '../template/chartRender.html',
      link: function (scope, element, attrs){

        var socialToneDataType = [];
        var socialToneDataScore = [];

        var writingToneDataType = [];
        var writingToneDataScore = [];

        var emotionToneDataType = [];
        var emotionToneDataScore = [];


          for (var i = 0; i < scope.idArray.length; i++) {
           var socialtoneScoreElements = [];
           var socialtoneNameElements = [];

           var writingtoneScoreElements = [];
           var writingtoneNameElements = [];

           var emotiontoneScoreElements = [];
           var emotiontoneNameElements = [];
            for (var j = 0; j < scope.idArray[i].social_tone_data.length; j++) {  
              socialtoneScoreElements.push(scope.idArray[i].social_tone_data[j].tone_score)
              socialtoneNameElements.push(scope.idArray[i].social_tone_data[j].tone_type)
            }
            for (var j = 0; j < scope.idArray[i].emotion_tone_data.length; j++) {  
              emotiontoneScoreElements.push(scope.idArray[i].emotion_tone_data[j].tone_score)
              emotiontoneNameElements.push(scope.idArray[i].emotion_tone_data[j].tone_type)
            }
            for (var j = 0; j < scope.idArray[i].writing_tone_data.length; j++) {  
              writingtoneScoreElements.push(scope.idArray[i].writing_tone_data[j].tone_score)
              writingtoneNameElements.push(scope.idArray[i].writing_tone_data[j].tone_type)
            }

            socialToneDataScore.push(socialtoneScoreElements)
            socialToneDataType.push(socialtoneNameElements)
            emotionToneDataType.push(emotiontoneNameElements)
            emotionToneDataScore.push(emotiontoneScoreElements)
            writingToneDataType.push(writingtoneNameElements)
            writingToneDataScore.push(writingtoneScoreElements)

            console.log(attrs.chartindex)
            console.log(socialToneDataType)
            console.log(socialToneDataScore)

            $(element).highcharts({
              title: {
                  text: 'Tone Analysis'
              },
              xAxis: [{
                  name: 'Social Tone Data',
                  categories: socialToneDataType[attrs.chartindex]
                }, {
                  name: 'Emotion Tone Data',
                  categories: emotionToneDataType[attrs.chartindex]
                }, {
                  name: 'Writing Tone Data',
                  categories: writingToneDataType[attrs.chartindex]
                }],
              yAxis: {
                  title: {
                      text: 'Tone Score'
                  }
              },
              series: [{
                  data: socialToneDataScore[attrs.chartindex],
                  name: 'Social Tone Trend',
                  type: 'column',
                  maxPointWidth: 15,
                  xAxis: 0
                }, {
                  data: emotionToneDataScore[attrs.chartindex],
                  name: 'Emotional Tone Trend',
                  type: 'column',
                  maxPointWidth: 15,
                  xAxis: 1
                }, {
                  data: writingToneDataScore[attrs.chartindex],
                  name: 'Writing Tone Trend',
                  type: 'column',
                  maxPointWidth: 15,
                  xAxis: 2
              }],
            });
            
            console.log(attrs.chartindex)

          }
        }
      }
  });