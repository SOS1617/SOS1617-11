exports.config = {
    
    seleniumAdress: 'http://localhost:9515',//donde tenemos el driver
    
    specs: ['T01-loadLfpChampion.js','T02-addLfpChampion.js'],//lista de tests a lanzar
    
    capabilities: {
        'browserName': 'phantomjs' //tipo de navegador que estoy lanzando
    }
};