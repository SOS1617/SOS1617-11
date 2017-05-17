//////////////SE INICIALIZA EL CONTROLADOR ////////////////////////

angular
    .module("sos1617-11-app")
    .controller("Pichichi-ctrl", ["$scope", "$http", function ($scope, $http){
    
     $scope.url = "/api/v1/lfppichichitrophy";
     $scope.apikey = "adrdavand";
     $scope.refresh = refresh();
    
    console.log("Controller initialized (splited right)");
    
    
    //CARGAR DATOS
       $scope.loadInitialData= function(){
            $http.get($scope.url+"/loadInitialData?apikey="+$scope.apikey)
            .then(function(response){
                console.log("Load initial data: OK");
                refresh();
            });
        };
        
        
        

   function refresh(){
       if($scope.apikey=="adrdavand"){
         $http
            .get($scope.url+"?apikey="+$scope.apikey)
                .then(function successCallback(response){
                    console.log($scope.apikey);
                    $scope.lfppichichitrophy = response.data;
                    if($scope.lfppichichitrophy.isEmpty){
                        document.getElementById("loadInitialData").disabled = false;
                    }else{
                        document.getElementById("loadInitialData").disabled = true;
                    }
            },function errorCallback(response){
                console.log("Error callback");
                $scope.lfppichichitrophy= [];
            });
        }else{
            $scope.lfppichichitrophy= [];
        }
    }

    
    
    
     // Comprueba apikey
          function  checkApiKey(dato) {
              if(dato == ""){
                   alert("Apikey vacía, por favor introduzca una apikey");
              }else{
           $http
            .get($scope.url+"?apikey="+dato)
                .then(function successCallback(response) {
                    alert("Apikey correcta");
                },function errorCallback(response){
                    alert("Apikey incorrecta, pida una apikey correcta al administrador");
                });
              }
              refresh();
        }
    
    
    
    //GET
     $scope.getData = function(){
         checkApiKey($scope.apikey);
         $http
            .get($scope.url+"?apikey="+ $scope.apikey)
                .then(function successCallback(response){
                    $scope.lfppichichitrophy= response.data;
                     if($scope.lfppichichitrophy.isEmpty){
                         document.getElementById("loadInitialData").disabled = false;
                    }else{
                       document.getElementById("loadInitialData").disabled = true;
                    }
                    console.log( "Showing data ");
            },function errorCallback(response){
                    $scope.lfppichichitrophy = [];
                });
                //refresh();
              }; 
    
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
        
         
         
         //MÉTODOS DE PAGINACIÓN
         
        $scope.viewby = 0;
        $scope.totalItems = function() {
            return $scope.lfppichichitrophy.length;
        };
        $scope.currentPage = 1;
        $scope.itemsPerPage = function() {
            return $scope.limit;
        };
        $scope.maxSize = 5; //Botones (1 xpagina) a mostrar 
        $scope.offset = 0;
        
        
        
        $scope.newPage = function(numberPage){
            var viewby = $scope.viewby;
            $scope.currentPage = numberPage;
            $scope.offset = numberPage*viewby-parseInt( $scope.viewby);
            $scope.limit = $scope.viewby;
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.lfppichichitrophy = response.data;
                });
            
        };
        
        $scope.nextPage = function(numberPage) {
            $scope.currentPage = numberPage;
            $scope.offset = parseInt($scope.offset) + parseInt($scope.viewby);
            console.log($scope.offset);
            $scope.limit = $scope.viewby;
            $http
                .get($scope.url+"?apikey= "+ $scope.apikey +"&limit= "+ $scope.limit +"&offset= " + $scope.offset)
                .then(function(response){
                    $scope.lfppichichitrophy = response.data;
                });
        };
        
        
        $scope.previousPage = function(numberPage) {
            var viewby = $scope.viewby;
            $scope.currentPage = numberPage;
            $scope.offset -= viewby;
            $http
                .get($scope.url+"?apikey= "+ $scope.apikey +"&limit= "+ $scope.limit +"&offset= " + $scope.offset)
                .then(function(response){
                    $scope.lfppichichitrophy = response.data;
                });
        };
        
        
        
        $scope.setItemsPerPage = function(numberPage) {
            $scope.itemsPerPage = numberPage;
            $scope.currentPage = 1;
            $scope.offset = 0;
            var pages =[];
             $http
                .get($scope.url+"?apikey="+ $scope.apikey)
                .then(function(response){
                    for(var i =1;i<=response.data.length / $scope.viewby;i++){
                        pages.push(i);
                    }
                    if(pages.length*$scope.viewby<response.data.length){
                        pages.push(pages.length+1);
                    }
                    $scope.pages = pages;
                        document.getElementById("pagination").style.display = "block";
                        document.getElementById("pagination").disabled = false;
                });
            
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit= " + numberPage +"&offset= "+ $scope.offset)
                    .then(function(response){
                        $scope.lfppichichitrophy = response.data;
                });
                
        };
    //refresh();
        
        
        
        //PAGINACIÓN2
    /*
     $scope.getPaginacion2 = function(offset){
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit=3"  +"&offset="+offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.lfppichichitrophy = response.data;
                    console.log( $scope.data );
                });
            
        } ;
        */
        
    
    //AÑADIR UN NUEVO PICHICHI
    $scope.addPichichi = function (){
        var datainput = $scope.newlfppichichitrophy;
        console.log("Pichichi" + datainput + "Created");
        $http
            .post($scope.url+"?apikey="+ $scope.apikey, datainput)
            .then(function (response){
                console.log("Pichichi added");
                refresh();
            },function(response) {
                    switch (response.status) {
                        case 409:
                            alert("Error, this pichichi already exist");
                            break;
                        case 400:
                            alert("There are empty fields");
                            break;
                        case 201:
                            alert("Pichichi created correctly");
                            break;
                        default:
                            alert("Error try again");
                            break;
                    }
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
                alert("Pichichi of the season:" + season + "deleted");
                refresh();
        });
    }
    
   
    //ELIMINAR LA LISTA
    $scope.deleteLista = function(){
            $http
                .delete($scope.url+"?apikey="+ $scope.apikey)
                .then(function successCallback(response){
                    console.log("List empty");
                    document.getElementById("loadInitialData").disabled = false;
                     alert("Set of pichichis deleted");
                },function errorCallback(response){
                   console.log("Error easing data");
                //refresh();
                
                });
                refresh();
        };
        
      
        //BÚSQUEDA
        $scope.search = function(){
            $http
                .get($scope.url+"?apikey="+$scope.apikey+"&season="+$scope.newlfppichichitrophy.season)
                    .then(function successCallback(response){
                        console.log("Muestra el pichichi de la temporada: " + $scope.newlfppichichitrophy.season);
                        $scope.data = JSON.stringify(response.data, null, 2);
                        $scope.lfppichichitrophy = response.data;
                    },function errorCallback(response){
                    console.log("Error in the search");
                   refresh();
                   
                });
        }
        
        
        
        //PAGINACIÓN
         /* $scope.currentPage = 0;
    $scope.pageSize = 3;
    $scope.data = [];
    $scope.q = '';
    
    $scope.getData1 = function () {
      return $filter('filter')($scope.data, $scope.q)
    }
    
    $scope.numberOfPages=function(){
        return Math.ceil($scope.getData1().length/$scope.pageSize);                
    }
    $scope.setPage = function(page){
        if(page>0 && page<$scope.numberOfPages()){
            $scope.currentPage=page;
        }
    }
    
    */
        
           
    }]);