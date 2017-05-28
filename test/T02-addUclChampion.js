describe('Add champion',function(){
    it('should add a economicSituation',function(){
        browser.get('http//localhost:8080');
        
        element.all(by.repeater(champion in uclchampions))
        .then(function(initialuclchampions){
            
            
           element(by.model('uclchampions.year')).sendKeys('2020');
           element(by.model('uclchampions.champion')).sendKeys('Sevilla');
           element(by.model('uclchampions.runnerup')).sendKeys('Betis');
           element(by.model('uclchampions.stadium')).sendKeys('Pizjuan');
           element(by.model('uclchampions.city')).sendKeys('Sevilla');

           
           element(by.buttonText('Add')).click().then(function(){
               
               element.all(by.repeater('champion in uclchampions'))
               .then(function(uclchampions){
                   expect(uclchampions.length)
                   .toEqual(initialuclchampions.length+1);
               });
               
               
               
               
               
               
           });
           
            
            
            
            
        });
    });
    
    
    
    
    
    
    
    
    
    
    
})