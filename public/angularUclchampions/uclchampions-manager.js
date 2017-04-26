  angular.module("UclchampionsManagerApp", ["ngRoute"]).config(function ($routeProvider){
    
      $routeProvider
      .when("/",{
        templateUrl : "list.html" ,
        controller : "Uclchampion-ctrl"
      })
      .when("/:year",{
        templateUrl : "edit.html",
        controller : "Edit-ctrl"
      });
    
    
    
    
      console.log("App inizialized and configured");

  });
    /*Si no ponemos el array vacio [] no estamos creando un módulo, si no 
    que estamo sdiciendole a angular que nos de el modulo con ese nombre*/
    
  