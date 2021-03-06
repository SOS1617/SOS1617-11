/*global response*/
/*global angular*/

angular
    .module("sos1617-11-app")
    .controller("LfpChampions-ctrl",["$scope","$http",function ($scope, $http){
         
        $scope.apikey = "adrdavand";
        $scope.data = {};
        var dataCache = {};
        $scope.datos = [];
        $scope.champion= [];
        
        
        $http.get("/api/v1/lfpchampions/"+ "?" + "apikey=" + $scope.apikey).then(function(response){
            
            dataCache = response.data;
            $scope.data = dataCache;
            
            for(var i=0; i<response.data.length; i++){
                $scope.datos.push($scope.data[i].season);
                $scope.champion.push($scope.data[i].champion);
                
                
                
                console.log($scope.data[i].championcity);
            }
        });    
          
           
            //Primera Grafica
     Highcharts.chart('container', {
    chart: {
        type: 'areaspline'
    },
    title: {
        text: 'Champions in LFP'
    },
    xAxis: {
        categories: $scope.datos
    },
    yAxis: {
        title: {
            text: 'Champions'
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
    series: [{
        name: 'Champion',
        data: $scope.champion
    }]
});
      
 function datos(){
      var ret=[];
     
     response.data.forEach(function(d){
         response.data.champion=d.champion;
         response.data.season = d.season;
        
          ret.push({"champion":response.data.champion,
          "season":response.data.season});
        
          });
     
      return ret;
     
  }
    }]);