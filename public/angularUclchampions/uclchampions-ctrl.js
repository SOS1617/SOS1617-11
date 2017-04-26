//////////////SE INICIALIZA EL CONTROLADOR ////////////////////////

var app = angular
    .module("UclchampionsManagerApp")
    .controller("Uclchampion-ctrl", ["$scope", "$http", function ($scope, $http){
    
     $scope.url = "/api/v1/uclchampions";
     $scope.apikey = "adrdavand";
    
    console.log("List controller initialized (splited right)");
    
    
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
                $scope.uclchampions = response.data;
            }, function errorCallback(response){
                console.log("Error callback");
            });
      
    }
    refresh();
    
    //GET
     $scope.getData = function(){
            $http
            .get($scope.url+"?apikey="+ $scope.apikey)
            .then(function(response){
               $scope.uclchampions= response.data;
                console.log( "Showing data " );
            
                });
                refresh();
                
              } 
    
    //PAGINACIÓN
    
    $scope.offset = 0;
     $scope.getPaginacion = function(){
           
            $http
                .get($scope.url+"?apikey="+ $scope.apikey +"&limit="+ $scope.limit +"&offset="+$scope.offset)
                .then(function(response){
                    $scope.data = JSON.stringify(response.data, null, 2); 
                    $scope.uclchampions = response.data;
                    console.log( $scope.data );
                });
            
        } ;
    
    
    //AÑADIR UN NUEVO CAMPEON
    $scope.adduclchampion = function (){
        var datainput = $scope.newuclchampions;
        console.log(datainput);
        $http
            .post($scope.url+"?apikey="+ $scope.apikey,datainput)
            .then(function (response){
                console.log("Contact added");
                refresh();
        });
    }
    
    
   /*
        //MODIFICAR UN CAMPEO
        $scope.editauclchampion = function(){
            $http.put($scope.url +"/" + $scope.newuclchampions.year +"?apikey=" + $scope.apikey,$scope.newuclchampions)
            .then(function(response){
                console.log("Campeon modificadao correctamente");
                refresh();
            });
            
        }
    
     */
    //ELIMINAR UN PICHICHI
     $scope.deleteuclchampion = function (year){
        $http
            .delete($scope.url+"/" + year +"/?apikey="+ $scope.apikey)
            .then(function (response){
                console.log("Campeon del año:" + year + "eliminado");
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
                .get($scope.url+"?apikey="+$scope.apikey+"&year="+$scope.newuclchampions.year)
                .then(function(response){
                    console.log("Muestra el campeon del año: " + $scope.newuclchampions.year);
                    $scope.data = JSON.stringify(response.data, null, 2);
                    $scope.uclchampions = response.data; 
                });
        }
        
        
        // -----------------------------------------
    $scope.currentPage = 0;
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
    
    
}]);
    
    app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
    });