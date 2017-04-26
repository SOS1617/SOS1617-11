var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

////////////MÓDULOS DE APIS//////////////
//////////////MÓDULO ADRI///////////////
var apiUclChampions = require("./apis/uclchampions.js");
/////////////////////MÓDULO DAVID/////////////////
var apilfppichichitrophy = require("./apis/lfppichichitrophy.js");
/////////////////////MÓDULO DAVID/////////////////
var apiLfpChampions = require("./apis/lfpchampions.js");

/////////////////////////CONEXIÓN CON LA BASE DE DATOS ///////////////////////////////////////////////

var MongoClient = require("mongodb").MongoClient;
var mdbURL = "mongodb://test:test@ds139480.mlab.com:39480/sandboxdbd";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";
var publicFolder = path.join(__dirname, 'public');

//BASE DE DATOS ADRIAN 
var db;
//BASE DE DATOS DAVID 
var dbd;
//BASE DE DATOS ANDRÉS
var dba;


MongoClient.connect(mdbURL, {native_parser:true}, function (err,database){
    
    if(err){
        console.log(err);
        process.exit(1);"apaga el servidor"
    }
    db = database.collection("uclchampions");
    dbd = database.collection("lfppichichitrophy");
    dba = database.collection("lfpchampions");
    
    //////////////////////////////CONEXIÓN CON MÓDULOS ///////////////////////////////////////////
    
    apiUclChampions.register(app, db, BASE_API_PATH, checkApiKeyFunction);
    apilfppichichitrophy.register(app, dbd, BASE_API_PATH, checkApiKeyFunction);
    apiLfpChampions.register(app, dba, BASE_API_PATH, checkApiKeyFunction);
    
    app.listen(port, ()=>{
        console.log("Magic is happening on port " + port);
});


});


// APIKEY
var API_KEY = "adrdavand";

// Helper method to check for apikey
var checkApiKeyFunction = function(request, response) {
    if (!request.query.apikey) {
        console.error('WARNING: No apikey was sent!');
        response.sendStatus(401);
        return false;
    }
    if (request.query.apikey !== API_KEY) {
        console.error('WARNING: Incorrect apikey was used!');
        response.sendStatus(403);
        return false;
    }
    return true;
};



var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

app.use("/", express.static(publicFolder));
app.use(BASE_API_PATH + "/tests", express.static(path.join(__dirname , "public/tests.html")));


////////////////////////////URL HTMLS///////////////////////



