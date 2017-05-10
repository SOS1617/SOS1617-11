//////////////SE INICIALIZA EL CONTROLADOR ////////////////////////

angular
    .module("LfpChampionsManagerApp")
    .controller("LfpChampions-ctrl", ["$scope", "$http", function ($scope, $http){
    
     $scope.url = "/api/v1/lfpchampions";
    
    console.log("Controller initialized (splited right)");
    
    function checkApiKey(){
             if(!$scope.apikey){
             $.notify("Error! API Key was empty!", "warn");
             }else{
                 if($scope.apikey != "GVAODcH3"){
                    $.notify("Error! API Key was incorrect!", "error");
                }
             }
        }
        
    function refresh(){
         $http
            .get($scope.url+"?apikey="+ $scope.apikey)
            .then(function (response){
                $scope.data = JSON.stringify(response.data, null, 2);
                $scope.lfpchampions = response.data;
            }, function errorCallback(response){
                console.log("Error callback");
            });
    }
    
    
    //CARGAR DATOS
       $scope.loadInitialData= function(){
           checkApiKey();
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(){
                console.log("Load initial data: OK");
                $.notify("Load Initial data Complete!", "success");
                refresh();
            })
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
    $scope.addLfpChampion = function (){
        var datainput = $scope.newLfpChampion;
        console.log(datainput);
        $http
            .post($scope.url+"?apikey="+ $scope.apikey,datainput)
            .then(function (response){
                console.log("Contact added");
                refresh();
        });
    }
    
     
    //ELIMINAR UN LFPCHAMPION
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
                .get($scope.url+"?apikey="+$scope.apikey+"&season="+$scope.newLfpChampion.season)
                .then(function(response){
                    console.log("Muestra el lfpchampions de la temporada: " + $scope.newLfpChampion.season);
                    $scope.data = JSON.stringify(response.data, null, 2);
                    $scope.lfpchampions = response.data; 
                });
        }
        
           
    }]);