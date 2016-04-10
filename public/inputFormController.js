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
        $scope.idArray = [];
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
        var socialToneDataType = [];
        var socialToneDataScore = [];

          for (var i = 0; i < scope.idArray.length; i++) {
           var toneScoreElements = [];
           var toneNameElements = [];
            for (var j = 0; j < scope.idArray[i].social_tone_data.length; j++) {  
              toneScoreElements.push(scope.idArray[i].social_tone_data[j].tone_score)
              toneNameElements.push(scope.idArray[i].social_tone_data[j].tone_type)
            }
            socialToneDataScore.push(toneScoreElements)
            console.log(socialToneDataScore)
            socialToneDataType.push(toneNameElements)
            console.log(socialToneDataType)

              $(element).highcharts({
                chart: {
                    type: 'bar',
                },
                title: {
                    text: 'Tone Data'
                },
                xAxis: {
                    categories: socialToneDataType[attrs.chartindex]
                },
                yAxis: {
                    title: {
                        text: 'Social Tone Score'
                    }
                },
                series: [{
                    data: socialToneDataScore[attrs.chartindex]
                }]
              });
          }
        }
      }
  });