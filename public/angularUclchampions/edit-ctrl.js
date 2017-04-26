  //////////////SE INICIALIZA EL CONTROLADOR ////////////////////////

angular
    .module("UclchampionsManagerApp")
    .controller("Edit-ctrl", ["$scope", "$http", "$routeParams", "$location",
    function ($scope, $http,$routeParams,$location){
    
     $scope.url = "/api/v1/uclchampions";
     
    
    console.log("Edit controller initialized");

   function refresh(){
         $http
            .get($scope.url+"/"+ $routeParams.year+"?apikey=adrdavand")
            .then(function (response){
                $scope.updatedUclchampion = response.data;
            });
    }
    refresh();
   
        //MODIFICAR UN CAMPEO
        $scope.editUclchampion = function(data){
            delete data._id;
            $http
            .put($scope.url +"/" + $scope.updatedUclchampion.year +"?apikey=adrdavand",$scope.updatedUclchampion)
            .then(function(response){
                console.log("Campeon modificadao correctamente");
                $location.path("/");
                
            });
            
        } 
    }]);