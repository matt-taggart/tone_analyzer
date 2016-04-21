angular.module('toneAnalyzer', ['ui.router', 'ui.tinymce', 'angular-loading-bar'])
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
            $rootScope.username = response.data.firstname;
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

// .service('sharedProperties', function() {
//   var username;

//   return {
//     setUsername: function(name) {
//       username = $rootScope.name;
//     }
//   }

//   return {
//     getUsername: function() {
//       return username;
//     }
//   }
// })

.controller('inputForm', function($scope, $http) {
  //Post content to be processed through API
    $scope.sendEmail = function() {
      $http({
        method: 'POST',
        url: '/send_email',
        data: $scope.emailData
      }).then(function(result) {
        console.log(result.data);
      })
    }
    $scope.analyzeTone = function(){
      $http.post('/tonetext', {
        content: $scope.toneText,
        userId: $scope.userData._id,
        draftTitle: $scope.draftTitle
      }).then(function(response) {
        $scope.draftTitle = '';
        $scope.renderDraftAndData(response.data._id);
        $scope.retrieveDraft();
      });
    };

    $scope.renderDraftAndData = function(id){
      $http.get('/textdata/' + id).then(function(response){
        $scope.draftData = response.data
        console.log($($scope.draftData[0].content).text())
        $scope.draftData[0].content = $($scope.draftData[0].content).text()
        $scope.idArray = [];
        angular.forEach($scope.draftData, function(value, key){
          $scope.value = value._id
          $scope.idArray.push({id: value._id, social_tone_data: value.social_tone_data, emotion_tone_data: value.emotion_tone_data, writing_tone_data: value.writing_tone_data})
        })
          var socialToneScore = [];
          var emotionToneScore = [];
          var writingToneScore = [];
          $scope.toneScoreArray = [];
        
          angular.forEach($scope.idArray, function(value, key) {
            angular.forEach(value.social_tone_data, function(value, key){
              socialToneScore.push(value.tone_score)
            })
            angular.forEach(value.emotion_tone_data, function(value, key){
              emotionToneScore.push(value.tone_score)
            })
            angular.forEach(value.writing_tone_data, function(value, key){
              emotionToneScore.push(value.tone_score)
            })

          $scope.toneScoreArray = socialToneScore.concat(emotionToneScore, writingToneScore)
          console.log($scope.toneScoreArray)
          $scope.generateHighchart();

          // $('draw-chart').highcharts({
          //   chart: {
          //       type: 'column',
          //       shadow: true
          //     },
          //     plotOptions: {
          //       series: {
          //         colorByPoint: true
          //       }
          //     },
          //      colors: [
          //       '#7cb5ec',
          //       '#434348',
          //       '#90ed7d',
          //       '#f7a35c',
          //       '#8085e9', 
          //       '#f15c80', 
          //       '#e4d354', 
          //       '#2b908f', 
          //       '#f45b5b', 
          //       '#91e8e1', 
          //       '#00cc99', 
          //       '#00c46d', 
          //       '#cc66ff'
          //   ],
          //   title: {
          //       text: 'Tone Analysis'
          //   },
          //   xAxis: [{
          //       categories: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Emotional Range', 'Anger', 'Disgust', 'Fear', 'Joy', 'Sadness', 'Analytical', 'Confident', 'Tentative']
          //     }],
          //   yAxis: {
          //       title: {
          //           text: 'Tone Score'
          //       }
          //   },
          //   series: [{
          //       data: $scope.toneScoreArray,
          //     }],
          //   legend: {
          //     enabled: false
          //   }
          // });
        })
      })
    }
    $scope.retrieveDraft = function(){
      $http.get('/drafts').then(function(response){
        $scope.drafts = response.data
        $scope.draftArray = [];
          angular.forEach($scope.drafts, function(value, key) {
            if (value.userId === $scope.userData._id) {
              $scope.draftArray.push(value)
            }
          })
      })
    }
    // $scope.retrieveUsername = function(){
    //   $http.get('/loggedin').then(function(response){
    //     $scope.firstname = response.data
    //   });
    // }
    $scope.generateHighchart = function(){
      $('draw-chart').highcharts({
        chart: {
            type: 'column',
            shadow: true
          },
          plotOptions: {
            series: {
              colorByPoint: true
            }
          },
           colors: [
            '#7cb5ec',
            '#434348',
            '#90ed7d',
            '#f7a35c',
            '#8085e9', 
            '#f15c80', 
            '#e4d354', 
            '#2b908f', 
            '#f45b5b', 
            '#91e8e1', 
            '#00cc99', 
            '#00c46d', 
            '#cc66ff'
        ],
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
            data: $scope.toneScoreArray,
          }],
        legend: {
          enabled: false
        }
      });
    }
    $scope.getUser = function(){
      $http.get('/loggedin').then(function(response){
        if (response.data.firstname) {
          $scope.userData = response.data;
          $scope.firstname = response.data.firstname;
          $scope.emailData.email = response.data.email;
          var el = angular.element(document.querySelector('#emailBtn'));
          el.attr('disabled', 'disabled');
          $('#tooltip-wrapper').tooltip({ trigger: 'hover', placement: 'right'});
        } else {
          $scope.userData = response.data;
          var el = angular.element(document.querySelector('#emailBtn'));
          el.removeAttr('disabled');
          $scope.firstname = response.data.googleName;
          $scope.emailData.email = response.data.googleEmail;
        }
      })
    }

    $scope.getText = function() {
      $scope.emailData.message = $scope.toneText;
    }

    $("#menu-toggle").click(function(e) {
     e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    });

    $scope.tinymceOptions = {
      plugins: 'link image code',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
    };
    
    $('#email-form').on('hidden.bs.modal', function (e) {
      $(this)
        .find(".enable")
           .val('')
    });
  })

