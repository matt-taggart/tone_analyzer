angular.module("toneDown", [])
  .controller('inputForm', function($scope, $http) {
    
    $scope.analyzeTone = function(){
      $http.post('/demobox/texttone', {
        content: $scope.textTone
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