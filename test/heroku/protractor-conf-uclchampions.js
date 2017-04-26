exports.config = {
    
    seleniumAdress: 'http://localhost:9515',//donde tenemos el driver
    
    specs: ['T01-uclchampions-LoadResources.js','T02-uclchampions-AddResource.js'],//lista de tests a lanzar
    
    capabilities: {
        'browserName': 'phantomjs' //tipo de navegador que estoy lanzando
    }
};