angular.module("toneDown", [])
  .controller('inputForm', function($scope, $http) {
    
    $scope.analyzeTone = function(){
      $http.get('/texttone').then(function(response){
        console.log('front end side')
        console.log(response)
      })

  })

    // $http.post('/analyzetext', {
      //   content: $scope.toneText,
      // }).then(function(){
      //   $scope.toneText = ''
      // });