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
            for (var j = 0; j < scope.idArray[i].writing_tone_data.length; j++) {  
              writingtoneScoreElements.push(scope.idArray[i].writing_tone_data[j].tone_score)
              writingtoneNameElements.push(scope.idArray[i].writing_tone_data[j].tone_type)
            }

            socialToneDataScore.push(socialtoneScoreElements)
            socialToneDataType.push(socialtoneNameElements)
            emotionToneDataType.push(emotiontoneNameElements)
            emotionToneDataScore.push(emotiontoneScoreElements)
            writingToneDataType.push(writingtoneNameElements)
            writingToneDataScore.push(writingtoneScoreElements)

            $(element).highcharts({
              title: {
                  text: 'Tone Analysis'
              },
              xAxis: [{
                  name: 'Social Tone Data',
                  categories: socialToneDataType[attrs.chartindex]
                }, {
                  name: 'Emotion Tone Data',
                  categories: emotionToneDataType[attrs.chartindex]
                }, {
                  name: 'Writing Tone Data',
                  categories: writingToneDataType[attrs.chartindex]
                }],
              yAxis: {
                  title: {
                      text: 'Tone Score'
                  }
              },
              series: [{
                  data: socialToneDataScore[attrs.chartindex],
                  name: 'Social Tone Trend',
                  type: 'column',
                  maxPointWidth: 15,
                  xAxis: 0
                }, {
                  data: emotionToneDataScore[attrs.chartindex],
                  name: 'Emotional Tone Trend',
                  type: 'column',
                  maxPointWidth: 15,
                  xAxis: 1
                }, {
                  data: writingToneDataScore[attrs.chartindex],
                  name: 'Writing Tone Trend',
                  type: 'column',
                  maxPointWidth: 15,
                  xAxis: 2
              }],
            });
          }
        }
      }
  });