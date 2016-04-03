angular.module("toneDown", [])
  .controller('inputForm', function($scope, $http) {
    $scope.analyzeTone = function(){
      console.log($scope.toneText)
      $http.post('/tonetext', {
        content: $scope.toneText
      }).then(function(){
        $scope.toneText = '';
        $scope.retrieveData();
      })
    }
    $scope.retrieveData = function(){
      $http.get('/calldata').then(function(response){
        $scope.toneDatas = response.data
      })
    }
  })

    // $http.post('/analyzetext', {
      //   content: $scope.toneText,
      // }).then(function(){
      //   $scope.toneText = ''
      // });