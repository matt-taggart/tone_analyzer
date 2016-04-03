angular.module("toneDown", [])
  .controller('inputForm', function($scope, $http) {
    $scope.analyzeTone = function(){
      console.log($scope.toneText)
      $http.post('/tonetext', {
        content: $scope.toneText
      }).then(function(){
        $scope.textTone = '';
      })
    }
    $scope.retrieveData = function(){
      $http.get('/calldata').then(function(response){

        $scope.toneDatas = response.data
        // console.log(response.data)

        angular.forEach(response.data, function(value, key){
          $scope.toneDatas.emotionData = value.emotion_tone_data
          console.log($scope.toneDatas.emotionData)
          $scope.toneDatas.writingData = value.writing_tone_data
          console.log($scope.toneDatas.writingData)
          $scope.toneDatas.socialData = value.social_tone_data
          console.log($scope.toneDatas.socialData)
        })
        debugger;
        // console.log(response.data)
        

      })
    }
  })

    // $http.post('/analyzetext', {
      //   content: $scope.toneText,
      // }).then(function(){
      //   $scope.toneText = ''
      // });