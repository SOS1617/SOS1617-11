//================================================UCLCHAMPIONS-STATS==============================================================
"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

var MongoClient = require("mongodb").MongoClient;

var mdbURL = "mongodb://test:test@ds139480.mlab.com:39480/sandboxdbd";


var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";


var db;
var dbd;

MongoClient.connect(mdbURL, {native_parser:true}, function (err,database){
    
    if(err){
        console.log(err);
        process.exit(1);"apaga el servidor"
    }
    db = database.collection("uclchampions");
    dbd = database.collection("players");
    
    app.listen(port, ()=>{
        console.log("Magic is happening on port " + port);
});


});

var app = express();

app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/api/v1/tests", express.static(path.join(__dirname , "public/tests.html")));



app.get(BASE_API_PATH + "/uclchampions/loadInitialData",function(request, response) {
    
    db.find({}).toArray(function(err,uclchampions){
        
         if (err) {
        console.error('WARNING: Error while getting initial data from DB');
        return 0;
    }
    
      if (uclchampions.length === 0) {
        console.log('INFO: Empty DB, loading initial data');

              var uclchampions = [{
                "year": "2016",
                "champion": "Real Madrid",
                "runnerup": "Atletico de Madrid",
                "stadium": "Estadio Giuseppe Meazza",
                "city": "Milan"
            },
            {
                "year": "2015",
                "champion": "Barcelona",
                "runnerup": "Juventus",
                "stadium": "Estadio Olímpico",
                "city": "Berlin"
            },
            {
                "year": "2014",
                "champion": "Real Madrid",
                "runnerup": "Atletico de Madrid",
                "stadium": "Estádio da Luz",
                "city": "Lisboa"
            }];
            db.insert(uclchampions);
      } else {
        console.log('INFO: DB has ' + uclchampions.length + ' results ');
    }
});
});






// GET a collection
app.get(BASE_API_PATH + "/uclchampions", function (request, response) {
    console.log("INFO: New GET request to /uclchampions");
    db.find({}).toArray(function (err, uclchampions) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending uclchampions: " + JSON.stringify(uclchampions, 2, null));
            response.send(uclchampions);
        }
    });
});


// GET a single resource
app.get(BASE_API_PATH + "/uclchampions/:year", function (request, response) {
    var year = request.params.year;
    if (!year) {
        console.log("WARNING: New GET request to /uclchampions/:year without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /uclchampions/" + year);
        db.find({year :year}).toArray(function (err, filteredUclchampions) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                if (filteredUclchampions.length > 0) {
                    var uclchampion = filteredUclchampions[0];
                    console.log("INFO: Sending uclchampion: " + JSON.stringify(uclchampion, 2, null));
                    response.send(uclchampion);
                } else {
                    console.log("WARNING: There are not any contact with player " + year);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


//POST over a collection
app.post(BASE_API_PATH + "/uclchampions", function (request, response) {
    var newUclchampion = request.body;
    if (!newUclchampion) {
        console.log("WARNING: New POST request to /uclchampions/ without uclchampion, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /uclchampions with body: " + JSON.stringify(newUclchampion, 2, null));
        if (!newUclchampion.year || !newUclchampion.champion || !newUclchampion.runnerup || !newUclchampion.stadium || !newUclchampion.city) {
            console.log("WARNING: The uclchampion " + JSON.stringify(newUclchampion, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}, function (err, uclchampions) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var uclchampionsBeforeInsertion = uclchampions.filter((uclchampion) => {
                        return (uclchampion.player.localeCompare(newUclchampion.year, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (uclchampionsBeforeInsertion.length > 0) {
                        console.log("WARNING: The uclchampion " + JSON.stringify(newUclchampion, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding uclchampion " + JSON.stringify(newUclchampion, 2, null));
                        db.insert(newUclchampion);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/uclchampions/:year", function (request, response) {
    var year = request.params.year;
    console.log("WARNING: New POST request to /uclchampions/" + year + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/uclchampions", function (request, response) {
    console.log("WARNING: New PUT request to /uclchampions, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
/*app.put(BASE_API_PATH + "/uclchampions/:year", function (request, response) {
    var updatedUclchampion = request.body;
    var year = request.params.year;
    if (!updatedUclchampion) {
        console.log("WARNING: New PUT request to /uclchampions/ without uclchampion, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /uclchampions/" + year + " with data " + JSON.stringify(updatedUclchampion, 2, null));
        if (!updatedUclchampion.year || !updatedUclchampion.champion || !updatedUclchampion.runnerup || !updatedUclchampion.stadium || !updatedUclchampion.city) {
            console.log("WARNING: The uclchampion " + JSON.stringify(updatedUclchampion, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}).toArray(function (err, uclchampions) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var uclchampionsBeforeInsertion = uclchampions.filter((uclchampion) => {
                        return (uclchampion.year === year);
                    });
                    if (uclchampionsBeforeInsertion.length > 0) {
                        db.update({year: year}, updatedUclchampion);
                        console.log("INFO: Modifying uclchampion with year " + year + " with data " + JSON.stringify(updatedUclchampion, 2, null));
                        response.send(updatedUclchampion); // return the updated uclchampion
                    } else {
                        console.log("WARNING: There are not any uclchampion with year " + year);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});
*/

app.put(BASE_API_PATH + "/provinces/:province", function (request, response) {
    var updatedUclchampion = request.body;
    var year = request.params.year;
    if (!updatedUclchampion) {
        console.log("WARNING: New PUT request to /uclchampions without stat, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /uclchampions" + year + " with data " + JSON.stringify(updatedUclchampion, 2, null));
        if (!updatedUclchampion.year || !updatedUclchampion.champion || !updatedUclchampion.runnerup || !updatedUclchampion.stadium || !updatedUclchampion.city) {
            console.log("WARNING: The stat " + JSON.stringify(updatedUclchampion, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}).toArray( function (err, uclchampions) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var uclchampionsBeforeInsertion = uclchampions.filter((stat) => {
                        return (stat.localeCompare(year, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (uclchampionsBeforeInsertion.length > 0) {
                        db.update({year:year}, updatedUclchampion);
                        console.log("INFO: Modifying stat with year " + year + " with data " + JSON.stringify(updatedUclchampion, 2, null));
                        response.send(updatedUclchampion); // return the updated stat
                    } else {
                        console.log("WARNING: There are not any stat with year " + year);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});



//DELETE over a collection
app.delete(BASE_API_PATH + "/uclchampions", function (request, response) {
    console.log("INFO: New DELETE request to /uclchampions");
    db.remove({},{multi: true}, function (err, result) {
        var numRemoved = JSON.parse(result);
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved.n> 0) {
                console.log("INFO: All the uclchampions (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no contacts to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/uclchampions/:year", function (request, response) {
    var yearParam = request.params.year;
    if (!yearParam) {
        console.log("WARNING: New DELETE request to /uclchampions/:year without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /uclchampions/" + yearParam);
        db.remove({year:yearParam},{},function (err, result) {
            var numRemoved = JSON.parse(result);
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: uclchampions removed: " + numRemoved);
                if (numRemoved.n === 1) {
                    console.log("INFO: The uclchampion with year " + yearParam + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no contacts to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


"use strict";
/* global __dirplayer */



//**********************************************************lfppichichitrophy*********************************




app.get(BASE_API_PATH + "/players/loadInitialData",function(request, response) {
    
    dbd.find({}).toArray(function(err,players){
            
        if (err) {
        console.error('WARNING: Error while getting initial data from DBD');
        return 0;
    }
    
    if (players.length === 0) {
        console.log('INFO: Empty DBD, loading initial data');

              var players = [
                {"nationality":"argentina","season":"2011-12","name":"messi","team":"fcb barcelona","goal":"50"},
                {"nationality": "portuguese", "season": "2013-14", "player":"cristiano ronaldo", "team": "real madrid", "goal": "31"},
                { "nationality": "brazilian", "season": "2003-04", "player":"ronaldo", "team": "real madrid", "goal": "24"}];
            dbd.insert(players);
      } else {
        console.log('INFO: DBD has ' + players.length + ' results ');
    }
});
});

// GET a collection -> va flama 
app.get(BASE_API_PATH + "/players", function (request, response) {
    console.log("INFO: New GET request to /players");
    dbd.find({}).toArray(function (err, players) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending players: " + JSON.stringify(players, 2, null));
            response.send(players);
        }
    });
});


// GET a single resource -> va ya flama también
app.get(BASE_API_PATH + "/players/:name", function (request, response) {
    var name = request.params.name;
    if (!name) {
        console.log("WARNING: New GET request to /players/:name without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /players/" + name);
         dbd.find({name :name}).toArray(function (err, filteredplayers){
        //db.find({}, function (err, players) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            }else{ /*else {
                var filteredplayers = players.filter((contact) => {
                    return (contact.name.localeCompare(name, "en", {'sensitivity': 'base'}) === 0);
                });*/
                if (filteredplayers.length > 0) {
                    var contact = filteredplayers[0]; //since we expect to have exactly ONE contact with this name
                    console.log("INFO: Sending contact: " + JSON.stringify(contact, 2, null));
                    response.send(contact);
                } else {
                    console.log("WARNING: There are not any contact with name " + name);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


//POST over a collection -> Crear un nuevo recurso VA FLAMAAAAAAAAAAAAAAAA
app.post(BASE_API_PATH + "/players", function (request, response) {
    var newplayers = request.body;
    if (!newplayers) {
        console.log("WARNING: New POST request to /players/ without player, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /players with body: " + JSON.stringify(newplayers, 2, null));
        if (!newplayers.nationality || !newplayers.season || !newplayers.name || !newplayers.team || !newplayers.goal) {
            console.log("WARNING: The player " + JSON.stringify(newplayers, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbd.find({}, function (err, players) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var playersBeforeInsertion = players.filter((player) => {
                        return (player.name.localeCompare(newplayers.name, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (playersBeforeInsertion.length > 0) {
                        console.log("WARNING: The player " + JSON.stringify(newplayers, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding player " + JSON.stringify(newplayers, 2, null));
                        dbd.insert(newplayers);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource -> Crear un recurso sobre un recurso -> Method Not Allowed -> VA FLAMAAAAA
app.post(BASE_API_PATH + "/players/:name", function (request, response) {
    var name = request.params.name;
    console.log("WARNING: New POST request to /players/" + name + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection -> Method Not Allowed -> VA BIEN 
app.put(BASE_API_PATH + "/players", function (request, response) {
    console.log("WARNING: New PUT request to /players, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/players/:name", function (request, response) {
    var updatedPlayer = request.body;
    var name = request.params.name;
    if (!updatedPlayer) {
        console.log("WARNING: New PUT request to /players/ without contact, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /players/" + name + " with data " + JSON.stringify(updatedPlayer, 2, null));
        if (!updatedPlayer.nationality || !updatedPlayer.season || !updatedPlayer.name || !updatedPlayer.team || !updatedPlayer.goal) {
            console.log("WARNING: The player " + JSON.stringify(updatedPlayer, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbd.find({}, function (err, players) {
                if (err) {
                    console.error('WARNING: Error getting data from DBD');
                    response.sendStatus(500); // internal server error
                } else {
                    var playersBeforeInsertion = players.filter((player) => {
                        return (player.name.localeCompare(updatedPlayer.name, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (playersBeforeInsertion.length > 0) {
                        dbd.update({name: name}, updatedPlayer);
                        console.log("INFO: Modifying contact with name " + name + " with data " + JSON.stringify(updatedPlayer, 2, null));
                        response.send(updatedPlayer); // return the updated contact
                    } else {
                        console.log("WARNING: There are not any contact with name " + name);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection -> VA FLAMA 
app.delete(BASE_API_PATH + "/players", function (request, response) {
    console.log("INFO: New DELETE request to /players");
    dbd.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the players (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no players to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource ->  VA BIEN
app.delete(BASE_API_PATH + "/players/:name", function (request, response) {
    var name = request.params.name;
    if (!name) {
        console.log("WARNING: New DELETE request to /players/:name without name, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /players/" + name);
        dbd.remove({name: name}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: players removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The contact with name " + name + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no players to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});





