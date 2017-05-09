  angular.module("LfpChampionsManagerApp", ["ngRoute"]).config(function ($routeProvider){
    
    $routeProvider
    
    .when("/", {
        templateUrl : "inicio.html",
        controller : "LfpChampions-ctrl"
    })
    .when("/update/:season", {
        templateUrl : "edit.html",
        controller : "EditCtrl"
    });
    
    console.log("App inizialized and configured");
    
  });
