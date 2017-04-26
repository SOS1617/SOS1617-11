angular
    .module("PichichiManagerApp")
    .controller("EditCtrl", ["$scope", "$http", function ($scope, $http){
    
     $scope.url = "/api/v1/lfppichichitrophy";
    
    console.log("Controller initialized (splited right)");
    
     function refresh(){
         $http
            .get($scope.url+"?apikey="+ $scope.apikey)
            /*.get("api/v1/lfppichichitrophy")*/
            .then(function (response){
                $scope.data = JSON.stringify(response.data, null, 2);
                $scope.lfppichichitrophy = response.data;
            }, function errorCallback(response){
                console.log("Error callback");
            });
    }
    
     //GET
     $scope.getData = function(){
            $http
            .get($scope.url+"?apikey="+ $scope.apikey)
            .then(function(response){
               $scope.lfppichichitrophy= response.data;
                console.log( "Showing data " );

                });
                
              } 
    
    
    
     //MODIFICAR UN PICHICHI
    $scope.editaPichichi = function(){
            $http.put($scope.url +"/" + $scope.newlfppichichitrophy.season +"?apikey=" + $scope.apikey,$scope.newlfppichichitrophy)
            .then(function(response){
                console.log("Pichichi modificadao correctamente");
                refresh();
            });
    };
    
    
    }]);