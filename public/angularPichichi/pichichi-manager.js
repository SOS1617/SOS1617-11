  angular.module("PichichiManagerApp", ["ngRoute"]).config(function ($routeProvider){
    
    $routeProvider
    
    .when("/", {
        templateUrl : "inicio.html",
        controller : "Pichichi-ctrl"
    })
    .when("/update/:season", {
        templateUrl : "edit.html",
        controller : "EditCtrl"
    });
    
    console.log("App inizialized and configured");
    
  });
