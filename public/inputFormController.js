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

        var highChartToneData = [];

        var idArray = []

        angular.forEach($scope.toneDatas, function(value, key) {

          idArray.push(value._id)

          for (var i = 0; i < idArray.length; i++) {
            console.log(idArray[i])
            console.log(idArray.length)
          };

            // angular.forEach(value.social_tone_data, function(value, key) {

              // highChartToneType.push(value.tone_type)
              // highChartToneScore.push(value.tone_score) 
              // $("#" + value._id).highcharts({
              //   chart: {
              //       type: 'bar'
              //   },
              //   title: {
              //       text: 'Fruit Consumption'
              //   },
              //   xAxis: {
              //       categories: highChartToneType
              //   },
              //   yAxis: {
              //       title: {
              //           text: 'Fruit eaten'
              //       }
              //   },
              //   series: [{
              //       data: highChartToneScore
              //   }]
              // });
            // })


        })
// console.log(idArray)
        
      });
    };
  });