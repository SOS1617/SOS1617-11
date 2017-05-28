  angular.module("sos1617-11-app", ["ngRoute"]).config(function ($routeProvider){
    
    $routeProvider
    .when("/", {
    
      templateUrl: "home.html",
    })
    .when("/integrations",{
        templateUrl: "integrations.html"
    })  
    
    .when("/analytics", {
            templateUrl: "/analytics.html",
            controller: "ChartsCtrl",
    })
    .when("/governance", {
            templateUrl: "/governance.html",
            
    })    
    .when("/lfppichichitrophy", {
        templateUrl : "angularPichichi/inicio.html",
        controller : "Pichichi-ctrl"
    })
    .when("/lfppichichitrophy/update/:season", {
        templateUrl : "angularPichichi/edit.html",
        controller : "EditCtrl"
    })
     .when("/lfpchampions", {
        templateUrl : "angularLfpChampions/inicio.html",
        controller : "LfpChampions-ctrl"
    })
    .when("lfpchampions/update/:season", {
        templateUrl : "angularLfpChampions/edit.html",
        controller : "EditCtrl"
    })
    .when("/lfpchampions/chart", {
            templateUrl: "/angularLfpChampions/chart-ctrl.html",
            controller: "LfpChampions-ctrl"
    });
    
    console.log("App inizialized and configured");
    
  });
