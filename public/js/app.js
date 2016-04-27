angular.module('toneAnalyzer', ['ui.router', 'ngSanitize', 'ui.tinymce', 'angular-loading-bar'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $provide) {
  $urlRouterProvider.otherwise('/welcome');

  //Check if the user is connected
  var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
    //Initialize a new promise
    var deferred = $q.defer();

    //Make an ajax call to check if user is logged in
    $http({
      method: 'GET',
      url: '/loggedin',
      ignoreLoadingBar: true
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

.controller('inputForm', function($scope, $http, $window) {
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
    $scope.analyzeOrUpdate = function(title){
      console.log(title)
      // $http.get('/decision/' + title)
    }
    $scope.analyzeTone = function(){
      // var raw = tinyMCE.activeEditor.getContent({format : 'raw'});
      // var raw = $($scope.draftData[0].content).text();
      // console.log(raw);
      $http.post('/tonetext', {
        htmlContent: $scope.toneText,
        content: $($scope.toneText).text(),
        userId: $scope.userData._id,
        draftTitle: $scope.draftTitle,
        ignoreLoadingBar: true
      }).then(function(response) {
        $scope.toneText = '';
        $scope.draftTitle = '';
        $scope.renderDraftAndData(response.data._id);
        $scope.retrieveDraft();
      });
    };
    $scope.renderDraftAndData = function(id){
      $http.get('/textdata/' + id, {
        ignoreLoadingBar: true
      }).then(function(response){
        $scope.draftData = response.data
        console.log($scope.draftData)
        $scope.htmlRender = $scope.draftData[0].htmlContent //render html to the DOM
        $scope.idArray = [];
        $scope.toggle = false;
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
        })
      })
    }

    $scope.retrieveDraft = function(){
      $http.get('/drafts', {
        ignoreLoadingBar: true
      }).then(function(response){
        $scope.drafts = response.data
        $scope.draftArray = [];
          angular.forEach($scope.drafts, function(value, key) {
            if (value.userId === $scope.userData._id) {
              $scope.draftArray.push(value)
            }
          })
      })
    }
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
            '#000066',
            '#90ed7d',
            '#f7a35c',
            '#8085e9',
            '#e60000',
            '#e4d354',
            '#2b908f',
            '#f45b5b',
            '#91e8e1',
            '#0000ff',
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
    $scope.updateText = function(id, htmlText){
      var text = $(htmlText).text()
      console.log(text)
      console.log(htmlText)
      $http.post('/updatetext/' + id, {htmlText: htmlText, text: text}, {
        ignoreLoadingBar: true
      }).then(function(response){
        $scope.renderDraftAndData(response.data._id);
        $scope.toggle = false;
      })
    }
    $scope.toggle = false;
    $scope.toggleEdit = function(){
      $scope.toggle = $scope.toggle === true ? false: true;
    };
    $scope.deleteDraft = function(id){
      $http.delete('/deletedraft/' +id, {
        ignoreLoadingBar: true
      }).then(function(){
        $scope.retrieveDraft();
      })
    }

    function capitalizeFirstLetter(string) {
        return string[0].toUpperCase() + string.slice(1);
    }

    $scope.getUser = function(){
      $http.get('/loggedin', {
        ignoreLoadingBar: true
      }).then(function(response){
        if (response.data.firstname) {
          $scope.userData = response.data;
          $scope.firstname = capitalizeFirstLetter(response.data.firstname);
          $scope.emailData.email = response.data.email;
          var el = angular.element(document.querySelector('#emailBtn'));
          el.attr('disabled', 'disabled');
          $('#tooltip-wrapper').tooltip({ trigger: 'hover', placement: 'right'});
        } else {
          $scope.userData = response.data;
          var el = angular.element(document.querySelector('#emailBtn'));
          el.removeAttr('disabled');
          $scope.firstname = capitalizeFirstLetter(response.data.googleName);
          $scope.emailData.email = response.data.googleEmail;
        }
      })
    }

    $scope.getText = function() {
      $scope.emailData.message = $scope.htmlRender;
    }

    $scope.sendEmail = function() {
      $http({
        method: 'POST',
        url: '/send_email',
        data: $scope.emailData,
        ignoreLoadingBar: true
      }).then(function(result) {
        $scope.isSuccessful = result.data.success;
        $scope.emailSuccessMsg = result.data.message;
      })
    }

    $scope.resetModal = function() {
      $scope.isSuccessful = false;
      $scope.userForm.$setPristine();
    }

    $scope.logout = function() {
      $http({
        method: 'POST',
        url: '/logout',
        ignoreLoadingBar: true
      }).then(function(result) {
        $window.location.href = '/welcome';
      });
    }

    $("#menu-toggle").click(function(e) {
     e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    });

    $scope.tinymceOptions = {
      plugins: 'link image code textcolor colorpicker',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | forecolor backcolor | fontsizeselect'
    };

    $('#email-form').on('hidden.bs.modal', function (e) {
      $(this)
        .find(".enable")
           .val('')
    });
  })
