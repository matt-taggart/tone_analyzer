angular.module("toneDown", [])
  .controller('inputForm', function($scope, $http) {
    
    $scope.analyzeTone = function(){
      $http.post('/texttone', {
        content: $scope.textTone
      }).then(function(response){
        console.log('front end side')
        console.log(response)
      })
    }
  })

    // $http.post('/analyzetext', {
      //   content: $scope.toneText,
      // }).then(function(){
      //   $scope.toneText = ''
      // });