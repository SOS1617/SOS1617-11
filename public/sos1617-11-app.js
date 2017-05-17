  angular.module("sos1617-11-app", ["ngRoute"]).config(function ($routeProvider){
    
    $routeProvider
    .when("/", {
    
      templateUrl: "home.html",
    })
    .when("/lfppichichitrophy", {
        templateUrl : "angularPichichi/inicio.html",
        controller : "Pichichi-ctrl"
    })
    .when("/lfppichichitrophy/update/:season", {
        templateUrl : "angularPichichi/edit.html",
        controller : "EditCtrl"
    });
    
    console.log("App inizialized and configured");
    
  });
