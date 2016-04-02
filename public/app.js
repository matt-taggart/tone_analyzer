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
  })

    // $http.post('/analyzetext', {
      //   content: $scope.toneText,
      // }).then(function(){
      //   $scope.toneText = ''
      // });