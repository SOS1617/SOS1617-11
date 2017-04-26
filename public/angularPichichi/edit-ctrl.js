angular
    .module("PichichiManagerApp")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", function ($scope, $http, $routeParams, $location){
    
     $scope.url = "/api/v1/lfppichichitrophy";
    
    console.log("Controller initialized");
    
     function refresh(){
         $http
            .get($scope.url+ "/"+ $routeParams.season + "?apikey=adrdavand")
            .then(function (response){
                $scope.lfppichichitrophy = response.data;
            });
    }
      refresh();
    
     //MODIFICAR UN PICHICHI
    $scope.editaPichichi = function(){
            $http.put($scope.url +"/" + $scope.newlfppichichitrophy.season +"?apikey=adrdavand" ,$scope.newlfppichichitrophy)
            .then(function(response){
                console.log("Pichichi modificadao correctamente");
                $location.path("/");
            });
    };
    
    }]);