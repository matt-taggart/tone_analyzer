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

        angular.forEach($scope.toneDatas, function(value, key) {
          $scope.value = value._id
          idArray.push({id: value._id, social_tone_data: value.social_tone_data})
          for (var i = 0; i < idArray.length; i++) {
            if (idArray[i].id === value._id) {
              console.log(idArray[i].id)
              $scope.socialToneName = []
              $scope.socialToneScore = []
              angular.forEach(value.social_tone_data, function(value, key) {
                $scope.socialToneScore.push(value.tone_score)
                $scope.socialToneName.push(value.tone_type)
              });
            }
          }
        });
      });
    }
  })
  .directive('drawChart', function() {
    return {
      restrict: 'EA',
      templateUrl: 'chartRender.html',
      link: function(scope, element, attrs){
        console.log(scope)
        console.log(element)
        console.log(attrs)
        console.log('in directive ' +scope.value._id)
          $(element).highcharts({
            chart: {
                type: 'bar',
            },
            title: {
                text: 'Tone Data'
            },
            xAxis: {
                categories: scope.socialToneName
            },
            yAxis: {
                title: {
                    text: 'Social Tone Score'
                }
            },
            series: [{
                data: scope.socialToneScore
            }]
          });
        }
      }
  })


// var chart = new Highcharts.chart(chartInfo)