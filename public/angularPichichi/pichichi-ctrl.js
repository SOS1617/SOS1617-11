//////////////SE INICIALIZA EL CONTROLADOR ////////////////////////

angular
    .module("PichichiManagerApp")
    .controller("Pichichi-ctrl", ["$scope", "$http", function ($scope, $http){
    
     $scope.url = "/api/v1/lfppichichitrophy";
    
    console.log("Controller initialized (splited right)");
    
    
    //CARGAR DATOS
       $scope.loadInitialData= function(){
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                console.log("Load initial data: OK");
                refresh();
            })
        }
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
    
    //PAGINACIÓN
    
    $scope.offset = 0;
     $scope.getPaginacion = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.lfppichichitrophy = response.data;
                    console.log( $scope.data );
                });
            
        } ;
    
    
    //AÑADIR UN NUEVO PICHICHI
    $scope.addPichichi = function (){
        var datainput = $scope.newlfppichichitrophy;
        console.log(datainput);
        $http
            .post($scope.url+"?apikey="+ $scope.apikey,datainput)
            .then(function (response){
                console.log("Contact added");
                refresh();
        });
    }
    
    
   
        //MODIFICAR UN PICHICHI
        /*$scope.editaPichichi = function(){
            $http.put($scope.url +"/" + $scope.newlfppichichitrophy.season +"?apikey=" + $scope.apikey,$scope.newlfppichichitrophy)
            .then(function(response){
                console.log("Pichichi modificadao correctamente");
                refresh();
            });
            
        }*/
     
    //ELIMINAR UN PICHICHI
     $scope.deletePichichi = function (season){
        $http
            .delete($scope.url+"/" + season +"/?apikey="+ $scope.apikey)
            .then(function (response){
                console.log("Pichichi de le temporada:" + season + "eliminado");
                refresh();
        });
    }
    
   
    //ELIMINAR LA LISTA
    $scope.deleteLista = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("LISTA VACÍA");
                    refresh();
                });
        }
        
      
        //BÚSQUEDA
        $scope.search = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&season="+$scope.newlfppichichitrophy.season)
                .then(function(response){
                    console.log("Muestra el pichichi de la temporada: " + $scope.newlfppichichitrophy.season);
                    $scope.data = JSON.stringify(response.data, null, 2);
                    $scope.lfppichichitrophy = response.data; 
                });
        }
        
           
    }]);