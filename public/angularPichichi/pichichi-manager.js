  angular.module("PichichiManagerApp", ["ngRoute"]).config(function ($routeProvider){
    
    $routeProvider
    .when("/pichichi-angular", {
      
      templateUrl : "inicio.html",
      controller : "Pichichi-ctrl"
    })
    .when("/pichichi-angular/update", {
      templateUrl : "edit.html",
      controller : "EditCtrl"
    });
    
    console.log("App inizialized and configured");
    
  });
    /*Si no ponemos el array vacio [] no estamos creando un módulo, si no 
    que estamo sdiciendole a angular que nos de el modulo con ese nombre*/
    
    
  