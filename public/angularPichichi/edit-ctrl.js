angular
    .module("PichichiManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function ($scope, $http, $routeParams, $location){
    
     $scope.url = "/api/v1/lfppichichitrophy";
    
    console.log("Edit controller initialized");
    
     function refresh(){
         $http
            .get($scope.url+ "/"+ $routeParams.season + "?apikey=adrdavand")
            .then(function (response){
                $scope.updatePichichi = response.data;
            });
    }
      refresh();
    
     //MODIFICAR UN PICHICHI
    $scope.editaPichichi = function(){
            $http.put($scope.url +"/" + $scope.updatePichichi.season +"?apikey=adrdavand" ,$scope.updatePichichi)
            .then(function(response){
                console.log("Pichichi modificadao correctamente");
                $location.path("/");
            });
    };
    refresh();
    
    }]);