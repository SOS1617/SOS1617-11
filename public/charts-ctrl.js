angular
    .module("sos1617-11-app")
    .controller("ChartsCtrl",["$scope","$http",function ($scope, $http){
        
        
        //LfpChampions
        
        $scope.apikey = "adrdavand";
        $scope.dataLfpChampions = {};
        var dataCacheLfpChampions = {};
        $scope.datos = [];
        $scope.season= [];
        $scope.champion = [];
      
        
        //Pichichi
        
        $scope.apikey = "adrdavand";
      
        //G11
        $scope.year = [];
        $scope.birthRate = [];
        
      
        //G02
        $scope.exportS = [];
        
        
    
            
       
            
            //Get LfpChampions
            
                    $http.get("/api/v1/lfpchampions"+ "?" + "apikey=" + $scope.apikey).then(function(response){
                
                        dataCacheLfpChampions = response.data;
                        $scope.dataLfpChampions =dataCacheLfpChampions;
                
                        for(var i=0; i<response.data.length; i++){
                            $scope.season.push($scope.dataLfpChampions[i].season);
                            $scope.champion.push($scope.dataLfpChampions[i].champion);
                }
                
                Highcharts.chart('container',{
                        title: {
                            text: 'Integrated G11 '
                        },
                        chart: {
                            type: 'bar'
                        },
                        xAxis: {
                            categories: $scope.season
                        },
                        legend: {
                            layout: 'vertical',
                            floating: true,
                            backgroundColor: '#FFFFFF',
                            //align: 'left',
                            verticalAlign: 'top',
                            align: 'right',
                            y: 20,
                            x: 0
                        },
                        tooltip: {
                            formatter: function () {
                                return '<b>' + this.series.name + '</b><br/>' +
                                   this.x + ': ' + this.y;
                            }
                        },
                        series:[{
                            name: 'Pichichi',
                            data: $scope.pichichi
                        },
                        {
                            name: 'LfpChampions',
                            data: $scope.lfpchampions
                        }]
                    });
        
            })
    }]);