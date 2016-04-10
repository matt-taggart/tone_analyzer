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
          $scope.idArray.push({id: value._id, social_tone_data: value.social_tone_data, emotion_tone_data: value.emotion_tone_data, writing_tone_data: value.writing_tone_data})
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

        var writingToneDataType = [];
        var writingToneDataScore = [];

        var emotionToneDataType = [];
        var emotionToneDataScore = [];


          for (var i = 0; i < scope.idArray.length; i++) {
           var socialtoneScoreElements = [];
           var socialtoneNameElements = [];

           var writingtoneScoreElements = [];
           var writingtoneNameElements = [];

           var emotiontoneScoreElements = [];
           var emotiontoneNameElements = [];
            for (var j = 0; j < scope.idArray[i].social_tone_data.length; j++) {  
              socialtoneScoreElements.push(scope.idArray[i].social_tone_data[j].tone_score)
              socialtoneNameElements.push(scope.idArray[i].social_tone_data[j].tone_type)
            }
            for (var j = 0; j < scope.idArray[i].emotion_tone_data.length; j++) {  
              emotiontoneScoreElements.push(scope.idArray[i].emotion_tone_data[j].tone_score)
              emotiontoneNameElements.push(scope.idArray[i].emotion_tone_data[j].tone_type)
            }

            socialToneDataScore.push(socialtoneScoreElements)
            // console.log(socialToneDataScore)
            socialToneDataType.push(socialtoneNameElements)
            // console.log(socialToneDataType)
            emotionToneDataType.push(emotiontoneNameElements)
            emotionToneDataScore.push(emotiontoneScoreElements)
            // console.log(emotionToneDataType)
            // console.log(emotionToneDataScore)

              $(element).highcharts({
                chart: {
                    type: 'bar',
                },
                title: {
                    text: 'Social Tone Trends'
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
                }],
                legend: {
                  enabled: false
                }
              });

              // $(element).highcharts({
              //   chart: {
              //       type: 'bar',
              //   },
              //   title: {
              //       text: 'Emotional Tone Trends'
              //   },
              //   xAxis: {
              //       categories: emotionToneDataType[attrs.chartindex]
              //   },
              //   yAxis: {
              //       title: {
              //           text: 'Emotion Tone Score'
              //       }
              //   },
              //   series: [{
              //       data: emotionToneDataScore[attrs.chartindex]
              //   }]
              // });
          }
        }
      }
  });