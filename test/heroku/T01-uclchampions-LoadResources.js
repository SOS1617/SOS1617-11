//Test para cargar datos

describe('Resources is loaded', function(){
    it('should show a bunch of data',function(){//en el it describimos que debe pasar 
        browser.get('http://localhost:8080');//El puerto es 8080 ya que estoy lanzando el navegador fantasma sobre lo que está en c9
        //me devuelve toda la lista de reccursos que hay.
        var uclchampions = element.all(by.repeater('champions in uclchampions'));//genera un array seleccionando todos los elementos de la pagina renderizada(element.all), seleccionando por una directiva (by.repeater) 
        //El tamaño del array debe ser mayor que x:
        expect(uclchampions.count()).toBeGreaterThan(6);
        
    });
    
});