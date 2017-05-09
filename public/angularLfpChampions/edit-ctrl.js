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
                $scope.updatedLfpChampions = response.data;
            });
    }
    
     //MODIFICAR UN LFPCHAMPIONS
    $scope.editaLfpChampions = function(data){
        delete data._id;
            $http
                .put($scope.url +"/" + $routeParams.season +"?apikey=adrdavand" ,$scope.updatedLfpChampions)
                .then(function(response){
                    console.log("LfpChampions modificadao correctamente");
                    $location.path("/");
            });
    };
    refresh();
    
    }]);