angular.module("toneDown")
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
        $scope.idArray = []
        angular.forEach($scope.toneDatas, function(value, key) {
          $scope.value = value._id
          $scope.idArray.push({id: value._id, social_tone_data: value.social_tone_data})
        });
      });
    }
  })
  .directive('drawChart', function() {
    return {
      restrict: 'EA',
      templateUrl: 'chartRender.html',
      link: function (scope, element, attrs){

        var socialToneName = [];
        var socialToneScore = [];

        angular.forEach(scope.idArray, function(value, key) {
          console.log(value.social_tone_data)
          angular.forEach(value.social_tone_data, function(value, key) {
            // console.log(value.tone_type)
            // console.log(value.tone_score)
            socialToneName.push(value.tone_type)
            socialToneScore.push(value.tone_score)

            $(element).highcharts({
              chart: {
                  type: 'bar',
              },
              title: {
                  text: 'Tone Data'
              },
              xAxis: {
                  categories: socialToneName
              },
              yAxis: {
                  title: {
                      text: 'Social Tone Score'
                  }
              },
              series: [{
                  data: socialToneScore
              }]
            });
          })
        })
        }
      }
  });