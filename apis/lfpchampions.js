//================================================LFPCHAMPIONS-STATS==============================================================

var exports = module.exports = {};

exports.register = function(app, dba, BASE_API_PATH,checkApiKeyFunction) {

app.get(BASE_API_PATH + "/lfpchampions/loadInitialData",function(request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    dba.find({}).toArray(function(err,lfpchampions){
        
         if (err) {
            console.error('WARNING: Error while getting initial data from dba');
            response.sendStatus(201);
            return 0;

        }
    
       if (lfpchampions.length === 0) {
        console.log('INFO: Empty dbaa, loading initial data');

              var lfpchampions = [
                {"champion": "Atlético Madrid", "championcity": "Madrid", "season": "2013-14", "runnerup": "F.C. Barcelona" },
                {"champion": "F.C. Barcelona", "championcity": "Barcelona", "season": "2014-15", "runnerup": "Real Madrid C.F." },
                {"champion": "F.C. Barcelona", "championcity": "Barcelona", "season": "2015-16", "runnerup": "Real Madrid C.F." }];
         dba.insert(lfpchampions);
        response.sendStatus(201);
        } else {
        console.log('INFO: dba has ' + lfpchampions.length + ' results ');
        }
    });
});


// GET a collection
app.get(BASE_API_PATH + "/lfpchampions", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    
    //variables busqueda
    var url = request.query;
    var champion = url.champion;
    var championcity = url.city;
    var season = url.season;
    var runnerup = url.runnerup;

    
    //variables paginacion
    var limit = parseInt(url.limit);
    var offset = parseInt(url.offset);
    var elementos = [];

    
    if(limit>0 && offset>0){
        console.log("INFO: New GET request to /lfpchampions");
        dba.find({}).skip(offset).limit(limit).toArray(function(err, lfpchampions) {
            if (err) {
                console.error('WARNING: Error getting data from dba');
                response.sendStatus(500); // internal server error
            } else {
                //console.log("INFO: Sending lfpchampions: " + JSON.stringify(lfpchampions, 2, null));
                //response.send(lfpchampions);
                var filtered = lfpchampions.filter((param) => {
                if ((champion == undefined || param.champion == champion) && (championcity == undefined || param.championcity == championcity) && 
                (season == undefined || param.season == season) && (runnerup == undefined || param.runnerup == runnerup)) {
                return param;
                }
                });
            }
         
        if (filtered.length > 0) {
            elementos = insertar(filtered, elementos,limit,offset);
            response.send(elementos);
          }
        else {
           console.log("WARNING: There are not any contact with this properties");
           response.sendStatus(404); // not found
        }
        });
    }else{
        dba.find({}).toArray(function(err, lfpchampions) {
        if (err) {
            console.error('WARNING: Error getting data from dba');
            response.sendStatus(500); // internal server error
        } else {
            //console.log("INFO: Sending lfpchampions: " + JSON.stringify(lfpchampions, 2, null));
            //response.send(lfpchampions);
            var filtered = lfpchampions.filter((param) => {
            if ((champion == undefined || param.champion == champion) && (championcity == undefined || param.championcity == championcity) && 
            (season == undefined || param.season == season) && (runnerup == undefined || param.runnerup == runnerup)) {
            return param;
            }
        });
        }
    if (filtered.length > 0) {
       console.log("INFO: Sending stat: "+ JSON.stringify(filtered, 2, null));
       response.send(filtered);
      }else{
//    if(lfpchampions.length >=0){
        response.send(lfpchampions);
    }
    //else{
      // console.log("WARNING: There are not any contact with this properties");
       //response.sendStatus(404); // not found
    //}
    });
    }
});

//Funcion paginacion
var insertar = function(elementos,array,limit,offset){
    var i = offset;
    var ii = limit;
    while(ii>0){
        array.push(elementos[i]);
        ii--;
        i++;
    }
    return elementos;
}


// GET a single resource
app.get(BASE_API_PATH + "/lfpchampions/:season", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var season = request.params.season;
    if (!season) {
        console.log("WARNING: New GET request to /lfpchampions/:season without season, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /lfpchampions/" + season);
        dba.find({season :season}).toArray(function (err, filteredlfpchampions) {
            if (err) {
                console.error('WARNING: Error getting data from dba');
                response.sendStatus(500); // internal server error
            } else {
                if (filteredlfpchampions.length > 0) {
                    var lfpchampion = filteredlfpchampions[0];
                    console.log("INFO: Sending lfpchampion: " + JSON.stringify(lfpchampion, 2, null));
                    response.send(lfpchampion);
                } else {
                    console.log("WARNING: There are not any contact with player " + season);
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});


//POST over a collection
app.post(BASE_API_PATH + "/lfpchampions", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var newLfpChampion = request.body;
    if (!newLfpChampion) {
        console.log("WARNING: New POST request to /lfpchampions/ without lfpchampion, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /lfpchampions with body: " + JSON.stringify(newLfpChampion, 2, null));
        if (!newLfpChampion.champion || !newLfpChampion.championcity || !newLfpChampion.season || !newLfpChampion.runnerup) {
            console.log("WARNING: The lfpchampion " + JSON.stringify(newLfpChampion, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dba.find({}).toArray(function (err, lfpchampions) {
                if (err) {
                    console.error('WARNING: Error getting data from dba');
                    response.sendStatus(500); // internal server error
                } else {
                    var lfpchampionsBeforeInsertion = lfpchampions.filter((lfpchampion) => {
                        return (lfpchampion.season.localeCompare(newLfpChampion.season, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (lfpchampionsBeforeInsertion.length > 0) {
                        console.log("WARNING: The lfpchampion " + JSON.stringify(newLfpChampion, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding lfpchampion " + JSON.stringify(newLfpChampion, 2, null));
                        dba.insert(newLfpChampion);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
});


//POST over a single resource
app.post(BASE_API_PATH + "/lfpchampions/:season", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var season = request.params.season;
    console.log("WARNING: New POST request to /lfpchampions/" + season + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/lfpchampions", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    console.log("WARNING: New PUT request to /lfpchampions, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/lfpchampions/:season", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var updatedLfpChampion = request.body;
    var season = request.params.season;
    if (!updatedLfpChampion) {
        console.log("WARNING: New PUT request to /lfpchampions/ without lfpchampion, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /lfpchampions/" + season + " with data " + JSON.stringify(updatedLfpChampion, 2, null));
        if(updatedLfpChampion.season!=season){
            console.log("WARNING: New PUT request to /lfpchampions/ with diferent season, sending 400...");
            response.sendStatus(400); // bad request
        }
        if (!updatedLfpChampion.champion || !updatedLfpChampion.championcity || !updatedLfpChampion.season || !updatedLfpChampion.runnerup) {
            console.log("WARNING: The lfpchampion " + JSON.stringify(updatedLfpChampion, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dba.find({}).toArray(function (err, lfpchampions) {
                if (err) {
                    console.error('WARNING: Error getting data from dba');
                    response.sendStatus(500); // internal server error
                } else {
                    var lfpchampionsBeforeInsertion = lfpchampions.filter((lfpchampion) => {
                        return (lfpchampion.season.localeCompare(updatedLfpChampion.season, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (lfpchampionsBeforeInsertion.length > 0) {
                        dba.update({season: season}, updatedLfpChampion);
                        console.log("INFO: Modifying lfpchampion with season " + season + " with data " + JSON.stringify(updatedLfpChampion, 2, null));
                        response.send(updatedLfpChampion); // return the updated lfpchampion
                    } else {
                        console.log("WARNING: There are not any lfpchampion with season " + season);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});




//DELETE over a collection
app.delete(BASE_API_PATH + "/lfpchampions", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    console.log("INFO: New DELETE request to /lfpchampions");
    dba.remove({},{multi: true}, function (err, result) {
        var numRemoved = JSON.parse(result);
        if (err) {
            console.error('WARNING: Error removing data from dba');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved.n> 0) {
                console.log("INFO: All the lfpchampions (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no contacts to delete");
                response.sendStatus(404); // not found
            }
        }
    });
});


//DELETE over a single resource
app.delete(BASE_API_PATH + "/lfpchampions/:season", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var seasonParam = request.params.season;
    if (!seasonParam) {
        console.log("WARNING: New DELETE request to /lfpchampions/:season without season, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /lfpchampions/" + seasonParam);
        dba.remove({season:seasonParam},{},function (err, result) {
            var numRemoved = JSON.parse(result);
            if (err) {
                console.error('WARNING: Error removing data from dba');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: lfpchampions removed: " + numRemoved);
                if (numRemoved.n === 1) {
                    console.log("INFO: The lfpchampion with season " + seasonParam + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no contacts to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    }
});
}