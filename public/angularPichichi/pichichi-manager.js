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
