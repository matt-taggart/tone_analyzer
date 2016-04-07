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

        var idArray = []

        angular.element(document).ready(function(){

        angular.forEach($scope.toneDatas, function(value, key) {
          idArray.push({id: value._id, social_tone_data: value.social_tone_data})
          for (var i = 0; i < idArray.length; i++) {
            if (idArray[i].id === value._id) {
              console.log(idArray[i].id)
              var socialToneName = []
              var socialToneScore = []
              angular.forEach(value.social_tone_data, function(value, key) {
                socialToneScore.push(value.tone_score)
                socialToneName.push(value.tone_type)
              })


              var chartInfo = {
                chart: {
                    type: 'bar',
                    renderTo: 'container'
                },
                title: {
                    text: 'Fruit Consumption'
                },
                xAxis: {
                    categories: socialToneName
                },
                yAxis: {
                    title: {
                        text: 'Fruit eaten'
                    }
                },
                series: [{
                    data: socialToneScore
                }]
              }
            }

            var chart = new Highcharts.chart(chartInfo)

          }

          // $("#container").highcharts({
          //   chart: {
          //       type: 'bar'
          //   },
          //   title: {
          //       text: 'Fruit Consumption'
          //   },
          //   xAxis: {
          //       categories: socialToneName
          //   },
          //   yAxis: {
          //       title: {
          //           text: 'Fruit eaten'
          //       }
          //   },
          //   series: [{
          //       data: socialToneScore
          //   }]
          // });
        });
      })
      });
    }
  });