angular
    .module("PichichiManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", 
    function ($scope, $http, $routeParams, $location){
    
     $scope.url = "/api/v1/lfppichichitrophy";
    
    console.log("Edit controller initialized");
    
     function refresh(){
         $http
            .get($scope.url+ "/"+ $routeParams.season + "?apikey=adrdavand")
            .then(function (response){
                $scope.updatedPichichi = response.data;
            });
    }
    
     //MODIFICAR UN PICHICHI
    $scope.editaPichichi = function(data){
        delete data._id;
            $http
                .put($scope.url +"/" + $routeParams.season +"?apikey=adrdavand" ,$scope.updatedPichichi)
                .then(function(response){
                    console.log("Pichichi modificadao correctamente");
                    $location.path("/");
            });
    };
    refresh();
    
    }]);