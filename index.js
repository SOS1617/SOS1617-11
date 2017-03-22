"use strict";
/* global __dirname */

var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var path = require('path');

var MongoClient = require('mongodb').MongoClient;

var mdbURL = "mongodb://test:test@ds139360.mlab.com:39360/sandboxadri";

var port = (process.env.PORT || 10000);
var BASE_API_PATH = "/api/v1";

var db;

MongoClient.connect(mdbURL,{native_parser:true},function(err,database){
    if(err){
        console.log("CANNOT CONNECT TO BD: " + err);
        process.exit(1);
    }
    db = database.collection("uclchampions");
    
    app.listen(port, ()=>{
        console.log("Magic is happening on port " + port);
    });

    
});


var app = express();

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
        db.find({"year" :year}, function (err, filteredUclchampions) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                if (filteredUclchampions.length > 0) {
                    var uclchampion = filteredUclchampions[0];
                    console.log("INFO: Sending uclchampion: " + JSON.stringify(uclchampion, 2, null));
                    response.send(uclchampion);
                } else {
                    console.log("WARNING: There are not any contact with name " + year);
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
                        return (uclchampion.name.localeCompare(newUclchampion.year, "en", {'sensitivity': 'base'}) === 0);
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
            db.find({}, function (err, uclchampions) {
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
    db.remove({}, {multi: true}, function (err, numRemoved) {
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
    var year = request.params.year;
    if (!year) {
        console.log("WARNING: New DELETE request to /uclchampions/:year without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /uclchampions/" + year);
        db.remove({year:year}, {}, function (err, numRemoved) {
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: uclchampions removed: " + numRemoved);
                if (numRemoved === 1) {
                    console.log("INFO: The uclchampion with year " + year + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no contacts to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


