describe('Add lfpchampion', function() {
    it('should add a new lfpchampion', function(){
        browser.get('http://localhost:8080');
        
        element.all(by.repeater('lfpchampion in lfpchampions')).then(function (initialLfpChampion){
            browser.driver.sleep(2000);
            
            element(by.model('newLfpChampion.champion')).sendKeys('Atlético Madrid');
            element(by.model('newLfpChampion.championcity')).sendKeys('Madrid');
            element(by.model('newLfpChampion.season')).sendKeys('2000-01');
            element(by.model('newLfpChampion.runnerup')).sendKeys('Real Betis Balompié');

            element(by.buttonText('Add')).click().then(function (){
                element.all(by.repeater('lfpchampion in lfpchampions')).then(function (lfpchampions) {
                    expect(lfpchampions.length).toEqual(initialLfpChampion.length+1);
                });
            });
        });
    });
});