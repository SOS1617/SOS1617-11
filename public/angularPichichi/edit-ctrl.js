angular
    .module("sos1617-11-app")
    .controller("EditCtrl", ["$scope", "$http", "$routeParams", "$location", 
    function ($scope, $http, $routeParams, $location){
    
     $scope.url = "/api/v1/lfppichichitrophy";
    
    console.log("Edit controller initialized");
    
     function refresh(){
         $http
            .get($scope.url+ "/"+ $routeParams.season + "?apikey=adrdavand")
            .then(function (response){
                $scope.updateTic = response.data;

                }, function errorCallback(response) {
                    console.log("Entra1");
                    $scope.updateTic = [];

                });
    }
    
     //MODIFICAR UN PICHICHI
    $scope.editaPichichi = function(data){
        delete data._id;
            $http
                .put($scope.url +"/" + $routeParams.season +"?apikey=adrdavand" ,$scope.updatedPichichi)
                .then(function(response){
                    console.log("Pichichi modificadao correctamente");
                     switch (response.status) {
                    case 400:
                        alert("Please fill all the fields");
                        break;
                    default:
                        alert("OK");
                        break;
}
            });
    };
    refresh();
    
    }]);