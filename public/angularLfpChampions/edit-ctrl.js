angular
    .module("LfpChampionsManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", 
    function ($scope, $http, $routeParams, $location){
    
     $scope.url = "/api/v1/lfpchampions";
    
    console.log("Edit controller initialized");
    
     function refresh(){
         $http
            .get($scope.url+ "/"+ $routeParams.season + "?apikey=adrdavand")
            .then(function (response){
                $scope.updatedLfpChampion = response.data;
            });
    }
    
     //MODIFICAR UN LFPCHAMPION
    $scope.editaLfpChampion = function(data){
        delete data._id;
            $http
                .put($scope.url +"/" + $routeParams.season +"?apikey=adrdavand" ,$scope.updatedLfpChampion)
                .then(function(response){
                    console.log("LfpChampion modificadao correctamente");
                    $location.path("/");
            });
    };
    refresh();
    
    }]);