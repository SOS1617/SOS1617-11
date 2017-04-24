//////////////SE INICIALIZA EL CONTROLADOR ////////////////////////

angular
    .module("LfpChampionsManagerApp")
    .controller("LfpChampions-ctrl", ["$scope", "$http", function ($scope, $http){
    
     $scope.url = "/api/v1/lfpchampions";
    
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
            /*.get("api/v1/lfpchampions")*/
            .then(function (response){
                $scope.data = JSON.stringify(response.data, null, 2);
                $scope.lfpchampions = response.data;
            }, function errorCallback(response){
                console.log("Error callback");
            });
    }
    
    //GET
     $scope.getData = function(){
            $http
            .get($scope.url+"?apikey="+ $scope.apikey)
            .then(function(response){
               $scope.lfpchampions= response.data;
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
                    $scope.lfpchampions = response.data;
                    console.log( $scope.data );
                });
            
        } ;
    
    
    //AÑADIR UN NUEVO LFPCHAMPIONS
    $scope.addLfpChampions = function (){
        var datainput = $scope.newlfpchampions;
        console.log(datainput);
        $http
            .post($scope.url+"?apikey="+ $scope.apikey,datainput)
            .then(function (response){
                console.log("Contact added");
                refresh();
        });
    }
    
    
   
        //MODIFICAR UN LFPCHAMPIONS
        $scope.editaLfpChampion = function(){
            $http.put($scope.url +"/" + $scope.newlfpchampions.season +"?apikey=" + $scope.apikey,$scope.newlfpchampions)
            .then(function(response){
                console.log("LfpChampion modificadao correctamente");
                refresh();
            });
            
        }
     
    //ELIMINAR UN LFPCHAMPIONS
     $scope.deleteLfpChampion = function (season){
        $http
            .delete($scope.url+"/" + season +"/?apikey="+ $scope.apikey)
            .then(function (response){
                console.log("LfpChampion de le temporada:" + season + "eliminado");
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
                .get($scope.url+"?apikey="+$scope.apikey+"&season="+$scope.newlfpchampions.season)
                .then(function(response){
                    console.log("Muestra el lfpchampions de la temporada: " + $scope.newlfpchampions.season);
                    $scope.data = JSON.stringify(response.data, null, 2);
                    $scope.lfpchampions = response.data; 
                });
        }
        
           
    }]);