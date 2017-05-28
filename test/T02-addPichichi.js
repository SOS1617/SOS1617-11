describe('Add pichichi', function() {
    it('should add a new pichichi', function(){
        browser.get('http://localhost:8080');
        
        element.all(by.repeater('pichichi in pichichis')).then(function (initialPichichi){
            browser.driver.sleep(2000);
            
            element(by.model('newPichichi.nationality')).sendKeys('argentina');
            element(by.model('newPichichi.seasson')).sendKeys('2000-01');
            element(by.model('newPichichi.name')).sendKeys('messi');
            element(by.model('newPichichi.team')).sendKeys('fcb barcelona');
            element(by.model('newPichichi.goal')).sendKeys('563');
            
            element(by.buttonText('Add')).click().then(function (){
                element.all(by.repeater('pichichi in pichichis')).then(function (pichichis) {
                    expect(pichichis.length).toEqual(initialPichichi.length+1);
                });
            });
        });
    });
});