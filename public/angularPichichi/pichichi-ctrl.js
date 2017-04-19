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
    /* $scope.loadInitialData= function(){
            $http.get("api/v1/lfppichichitrophy"+"/loadInitialData?apikey=adrdavand")
            .then(function(){
                console.log("Load initial data: OK");
                refresh();
            })
        }*/
        
      /*  function refresh(){
         $http
            .get("api/v1/lfppichichitrophy"+"?apikey=adrdavand")
            /*.get("api/v1/lfppichichitrophy")
            .then(function (response){
                $scope.data = JSON.stringify(response.data, null, 2);
                $scope.lfppichichitrophy = response.data;
            }, function errorCallback(response){
                console.log("Error callback");
            });}
    */
    
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
    
    
    //AÑADIR UN NUEVO PICHICHI
    $scope.addPichichi = function (){
        $http
            .post($scope.url +"?apikey="+ $scope.apikey,$scope.newPichichi)
            .then(function (response){
                console.log("Contact added");
                refresh();
        });
    }
    
    
       
    
   /* $scope.addPichichi = function (){
        $http
            .post("/api/v1/lfppichichitrophy" +"?apikey=adrdavand"+ $scope.newPichichi)
            .then(function (response){
                console.log("Contact added");
                refresh();
        });
    }*/

        
        //MODIFICAR UN PICHICHI
        $scope.editaPichichi = function(){
            $http.put($scope.url +"/" + $scope.newPichichi.pichichi +"?apikey=" + $scope.apikey,$scope.newPichichi)
            .then(function(response){
                console.log("Pichichi modificadao correctamente");
                refresh();
            });
            
        }
        
         /* $scope.editaPichichi = function(){
            $http.put("/api/v1/lfppichichitrophy" +"/" + $scope.newPichichi.pichichi +"?apikey=adrdavand" +$scope.newPichichi)
            .then(function(response){
                console.log("Pichichi modificadao correctamente");
                refresh();
            });
            
        }*/

    //ELIMINAR UN PICHICHI
     $scope.deletePichichi = function (season){
         console.log("Eliminando el pichichi de la temporada" + season);
        $http
            .delete($scope.url+"/" + $scope.newPichichi.season +"/?apikey="+ $scope.apikey)
            .then(function (response){
                console.log("Pichichi de le temporada:" + $scope.newPichichi.season + "eliminado");
                refresh();
        });
    }
    
    /*$scope.deletePichichi = function (season){
         console.log("Eliminando el pichichi de la temporada" + season);
        $http
            .delete("/api/v1/lfppichichitrophy"+"/" + season +"/?apikey=adrdavand")
            .then(function (response){
                console.log("Pichichi de le temporada:" + season + "eliminado");
                refresh();
        });
    }*/
    
    //ELIMINAR LA LISTA
    $scope.deleteLista = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    console.log("LISTA VACÍA");
                    refresh();
                });
        }
        /*
        
         $scope.deleteLista = function(){
            $http
                .delete("/api/v1/lfppichichitrophy"+"?apikey=adrdavand")
                .then(function(response){
                    console.log("LISTA VACÍA");
                    refresh();
                });
        }*/
        
        
        //BÚSQUEDA
        $scope.search = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&season="+$scope.newPichichi.season)
                .then(function(response){
                    console.log("El pichichi de la temporada: " + $scope.newPichichi.season + "es" + $scope.newPichichi.name);
                    $scope.data = JSON.stringify(response.data, null, 2);
                    $scope.lfppichichitrophy = response.data; 
                });
        }
            //BUSQUEDA DE UN RANGO
          /*$scope.search = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&from="+$scope.newPichichi.from+"&to="+$scope.newPichichi.to)
                .then(function(response){
                    console.log("El pichichi de la temporada: " + $scope.newPichichi.season + "es" + $scope.newPichichi.name);
                    $scope.data = JSON.stringify(response.data, null, 2);
                    $scope.lfppichichitrophy = response.data; 
                });
        }*/
        
        
        /*
        
        $scope.search = function(){
            $http
                .get("/api/v1/lfppichichitrophy"+"?apikey=adrdavand" + "&season="+$scope.newPichichi.season)
                .then(function(response){
                    console.log("El pichichi de la temporada: " + $scope.newPichichi.season + "es" + $scope.newPichichi.name);
                    $scope.data = JSON.stringify(response.data, null, 2);
                    $scope.lfppichichitrophy = response.data; 
                });
        }*/
           
    
    //refresh();
    }]);