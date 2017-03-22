//================================================UCLCHAMPIONS-STATS==============================================================
"use strict";
/* global __dirplayer */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

var MongoClient = require('mongodb').MongoClient;

var mdbURL = "mongodb://test:test@ds139360.mlab.com:39360/sandboxadri";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var db;
var dbd;
 

//app.use("/",express.static(path.join(__dirplayer,"public")));

MongoClient.connect(mdbURL,{native_parser:true},function(err,database){
    if(err){
        console.log("CANNOT CONNECT TO BD: " + err);
        process.exit(1);
    }
    db = database.collection("uclchampions");
    dbd = database.collection("lfppichichitrophy");
    
    app.listen(port, ()=>{
        console.log("Magic is happening on port " + port);
    });

    
});
var app = express();
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




app.use(bodyParser.json()); //use default json enconding/decoding
app.use(helmet()); //improve security


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
app.put(BASE_API_PATH + "/contacts", function (request, response) {
    console.log("WARNING: New PUT request to /uclchampions, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/uclchampions/:year", function (request, response) {
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
                        return (uclchampion.year.localeCompare(year, "en", {'sensitivity': 'base'}) === 0);
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


//DELETE over a collection
app.delete(BASE_API_PATH + "/uclchampions", function (request, response) {
    console.log("INFO: New DELETE request to /uclchampions");
    db.remove({}).toArray({multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
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
        db.remove({year:yearParam},{},function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: uclchampions removed: " + numRemoved);
                if (numRemoved === 1) {
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
// GET a collection
app.get(BASE_API_PATH + "lfppichichitrophy", function (request, response) {
    console.log("INFO: New GET request to lfppichichitrophy");
    dbd.find({}).toArray(function (err, lfppichichitrophy) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            console.log("INFO: Sending lfppichichitrophy: " + JSON.stringify(lfppichichitrophy, 2, null));
            response.send(lfppichichitrophy);
        }
    });
});


// GET a single resource
app.get(BASE_API_PATH + "lfppichichitrophy/:player", function (request, response) {
    var player = request.params.player;
    if (!player) {
        console.log("WARNING: New GET request to lfppichichitrophy/:player without player, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to lfppichichitrophy/" + player);
        dbd.find({"player" :player}).toArray(function (err, filteredlfppichichitrophy) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                if (filteredlfppichichitrophy.length > 0) {
                    var uclchampion = filteredlfppichichitrophy[0];
                    console.log("INFO: Sending uclchampion: " + JSON.stringify(uclchampion, 2, null));
                    response.send(uclchampion);
                } else {
                    console.log("WARNING: There are not any contact with player " + player);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


//POST over a collection
app.post(BASE_API_PATH + "lfppichichitrophy", function (request, response) {
    var newUclchampion = request.body;
    if (!newUclchampion) {
        console.log("WARNING: New POST request to lfppichichitrophy/ without uclchampion, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to lfppichichitrophy with body: " + JSON.stringify(newUclchampion, 2, null));
        if (!newUclchampion.player || !newUclchampion.champion || !newUclchampion.runnerup || !newUclchampion.stadium || !newUclchampion.city) {
            console.log("WARNING: The uclchampion " + JSON.stringify(newUclchampion, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbd.find({}, function (err, lfppichichitrophy) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var lfppichichitrophyBeforeInsertion = lfppichichitrophy.filter((uclchampion) => {
                        return (uclchampion.player.localeCompare(newUclchampion.player, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (lfppichichitrophyBeforeInsertion.length > 0) {
                        console.log("WARNING: The uclchampion " + JSON.stringify(newUclchampion, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding uclchampion " + JSON.stringify(newUclchampion, 2, null));
                        dbd.insert(newUclchampion);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "lfppichichitrophy/:player", function (request, response) {
    var player = request.params.player;
    console.log("WARNING: New POST request to lfppichichitrophy/" + player + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/contacts", function (request, response) {
    console.log("WARNING: New PUT request to lfppichichitrophy, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "lfppichichitrophy/:player", function (request, response) {
    var updatedUclchampion = request.body;
    var player = request.params.player;
    if (!updatedUclchampion) {
        console.log("WARNING: New PUT request to lfppichichitrophy/ without uclchampion, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to lfppichichitrophy/" + player + " with data " + JSON.stringify(updatedUclchampion, 2, null));
        if (!updatedUclchampion.player || !updatedUclchampion.champion || !updatedUclchampion.runnerup || !updatedUclchampion.stadium || !updatedUclchampion.city) {
            console.log("WARNING: The uclchampion " + JSON.stringify(updatedUclchampion, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbd.find({}, function (err, lfppichichitrophy) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var lfppichichitrophyBeforeInsertion = lfppichichitrophy.filter((uclchampion) => {
                        return (uclchampion.player.localeCompare(player, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (lfppichichitrophyBeforeInsertion.length > 0) {
                        dbd.update({player: player}, updatedUclchampion);
                        console.log("INFO: Modifying uclchampion with player " + player + " with data " + JSON.stringify(updatedUclchampion, 2, null));
                        response.send(updatedUclchampion); // return the updated uclchampion
                    } else {
                        console.log("WARNING: There are not any uclchampion with player " + player);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});


//DELETE over a collection
app.delete(BASE_API_PATH + "lfppichichitrophy", function (request, response) {
    console.log("INFO: New DELETE request to lfppichichitrophy");
    dbd.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved > 0) {
                console.log("INFO: All the lfppichichitrophy (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no contacts to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "lfppichichitrophy/:player", function (request, response) {
    var player = request.params.player;
    if (!player) {
        console.log("WARNING: New DELETE request to lfppichichitrophy/:player without player, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to lfppichichitrophy/" + player);
        dbd.remove({player:player}, {}).toArray(function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: lfppichichitrophy removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The uclchampion with player " + player + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no contacts to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});





