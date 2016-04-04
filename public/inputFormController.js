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
        console.log($scope.toneDatas)

        var toneDataHighChartToneType = [];
        var toneDataHighChartToneScore = [];

        angular.forEach($scope.toneDatas, function(value, key) {
          angular.forEach(value.social_tone_data, function(value, key) {
            toneDataHighChartToneType.push(value.tone_type)
            toneDataHighChartToneScore.push(value.tone_score) 
          })
        })

        console.log('array printing')

        $("#container").highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: toneDataHighChartToneType
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            data: toneDataHighChartToneScore
        }]
    });
      });
    };
  });