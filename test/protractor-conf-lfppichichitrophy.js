exports.config = {
    
    seleniumAdress: 'http://localhost:9515',//donde tenemos el driver
    
    specs: ['T01-loadPichichi.js','T02-addPichichi.js'],//lista de tests a lanzar
    
    capabilities: {
        'browserName': 'phantomjs' //tipo de navegador que estoy lanzando
    }
};