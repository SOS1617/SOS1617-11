var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

////////////MÓDULOS DE APIS//////////////
//////////////MÓDULO ADRI///////////////
var apiUclChampions = require("./apis/uclchampions.js");
/////////////////////MÓDULO DAVID/////////////////
var apilfppichichitrophy = require("./apis/lfppichichitrophy.js");

/////////////////////////CONEXIÓN CON LA BASE DE DATOS ///////////////////////////////////////////////

var MongoClient = require("mongodb").MongoClient;
var mdbURL = "mongodb://test:test@ds139480.mlab.com:39480/sandboxdbd";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";


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

app.use("/", express.static(path.join(__dirname, "public")));
app.use(BASE_API_PATH + "/tests", express.static(path.join(__dirname , "tests")));




//**********************************************************LFPCHAMPIONS-STATS*********************************




app.get(BASE_API_PATH + "/lfpchampions/loadInitialData",function(request, response) {
    
    dba.find({}).toArray(function(err,lfpchampions){
            
        if (err) {
        console.error('WARNING: Error while getting initial data from dba');
        return 0;
    }
    
    if (lfpchampions.length === 0) {
        console.log('INFO: Empty dba, loading initial data');

              var lfpchampions = [
                {"champion": "Atlético Madrid", "championcity": "Madrid", "season": "2013-14", "runnerup": "F.C. Barcelona" },
                {"champion": "F.C. Barcelona", "championcity": "Barcelona", "season": "2014-15", "runnerup": "Real Madrid C.F." },
                {"champion": "F.C. Barcelona", "championcity": "Barcelona", "season": "2015-16", "runnerup": "Real Madrid C.F." }];
         db.insert(lfpchampions);
        response.sendStatus(201);
        } else {
        console.log('INFO: DB has ' + lfpchampions.length + ' results ');
        }
    });
});

// GET a collection -> va flama 
app.get(BASE_API_PATH + "/lfpchampions", function (request, response) {
    console.log("INFO: New GET request to /lfpchampions");
    dba.find({}).toArray(function (err, lfpchampions) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending lfpchampions: " + JSON.stringify(lfpchampions, 2, null));
            response.send(lfpchampions);
            response.sendStatus(200);
        }
    });
});



// GET a single resource -> va ya flama también
app.get(BASE_API_PATH + "/lfpchampions/:season", function (request, response) {
    var season = request.params.season;
    if (!season) {
        console.log("WARNING: New GET request to /lfpchampions/:season without season, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /lfpchampions/" + season);
         dba.find({season :season}).toArray(function (err, filteredlfpchampions){
        //dba.find({}, function (err, lfpchampions) {
            if (err) {
                console.error('WARNING: Error getting data from dba');
                response.sendStatus(500); // internal server error
            }else{ /*else {
                var filteredlfpchampions = lfpchampions.filter((contact) => {
                    return (contact.season.localeCompare(season, "en", {'sensitivity': 'base'}) === 0);
                });*/
                if (filteredlfpchampions.length > 0) {
                    var contact = filteredlfpchampions[0]; //since we expect to have exactly ONE contact with this season
                    console.log("INFO: Sending contact: " + JSON.stringify(contact, 2, null));
                    response.send(contact);
                } else {
                    console.log("WARNING: There are not any contact with season " + season);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


//POST over a collection -> Crear un nuevo recurso VA FLAMAAAAAAAAAAAAAAAA
app.post(BASE_API_PATH + "/lfpchampions", function (request, response) {
    var newlfpchampions = request.body;
    if (!newlfpchampions) {
        console.log("WARNING: New POST request to /lfpchampions/ without lfpchampion, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /lfpchampions with body: " + JSON.stringify(newlfpchampions, 2, null));
        if (!newlfpchampions.champion || !newlfpchampions.championcity || !newlfpchampions.season || !newlfpchampions.runnerup) {
            console.log("WARNING: The lfpchampion " + JSON.stringify(newlfpchampions, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dba.find({}, function (err, lfpchampions) {
                if (err) {
                    console.error('WARNING: Error getting data from dba');
                    response.sendStatus(500); // internal server error
                } else {
                    var lfpchampionsBeforeInsertion = lfpchampions.filter((lfpchampion) => {
                        return (lfpchampion.season.localeCompare(newlfpchampions.season, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (lfpchampionsBeforeInsertion.length > 0) {
                        console.log("WARNING: The lfpchampion " + JSON.stringify(newlfpchampions, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding lfpchampion " + JSON.stringify(newlfpchampions, 2, null));
                        dba.insert(newlfpchampions);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource -> Crear un recurso sobre un recurso -> Method Not Allowed -> VA FLAMAAAAA
app.post(BASE_API_PATH + "/lfpchampions/:season", function (request, response) {
    var season = request.params.season;
    console.log("WARNING: New POST request to /lfpchampions/" + season + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection -> Method Not Allowed -> VA BIEN 
app.put(BASE_API_PATH + "/lfpchampions", function (request, response) {
    console.log("WARNING: New PUT request to /lfpchampions, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/lfpchampions/:season", function (request, response) {
    var updatedlfpchampion = request.body;
    var season = request.params.season;
    if (!updatedlfpchampion) {
        console.log("WARNING: New PUT request to /lfpchampions/ without contact, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /lfpchampions/" + season + " with data " + JSON.stringify(updatedlfpchampion, 2, null));
        if (!updatedlfpchampion.champion || !updatedlfpchampion.championcity || !updatedlfpchampion.season || !updatedlfpchampion.runnerup) {
            console.log("WARNING: The lfpchampion " + JSON.stringify(updatedlfpchampion, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dba.find({}, function (err, lfpchampions) {
                if (err) {
                    console.error('WARNING: Error getting data from dba');
                    response.sendStatus(500); // internal server error
                } else {
                    var lfpchampionsBeforeInsertion = lfpchampions.filter((lfpchampion) => {
                        return (lfpchampion.season.localeCompare(updatedlfpchampion.season, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (lfpchampionsBeforeInsertion.length > 0) {
                        dba.update({season: season}, updatedlfpchampion);
                        console.log("INFO: Modifying contact with season " + season + " with data " + JSON.stringify(updatedlfpchampion, 2, null));
                        response.send(updatedlfpchampion); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any contact with season " + season);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection -> VA FLAMA 
app.delete(BASE_API_PATH + "/lfpchampions", function (request, response) {
    console.log("INFO: New DELETE request to /lfpchampions");
    dba.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from dba');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the lfpchampions (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no lfpchampions to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource ->  VA BIEN
app.delete(BASE_API_PATH + "/lfpchampions/:season", function (request, response) {
    var season = request.params.season;
    if (!season) {
        console.log("WARNING: New DELETE request to /lfpchampions/:season without season, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /lfpchampions/" + season);
        dba.remove({season: season}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from dba');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: lfpchampions removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The contact with season " + season + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no lfpchampions to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});




