//================================================UCLCHAMPIONS-STATS==============================================================

var exports = module.exports = {};

exports.register = function(app, db, BASE_API_PATH,checkApiKeyFunction) {

app.get(BASE_API_PATH + "/uclchampions/loadInitialData",function(request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    db.find({}).toArray(function(err,uclchampions){
        
         if (err) {
            console.error('WARNING: Error while getting initial data from DB');
            response.sendStatus(201);
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
        response.sendStatus(201);
        } else {
        console.log('INFO: DB has ' + uclchampions.length + ' results ');
        }
    });
});

function paginate(offset, limit, array, response) {
        var res = [];
        var cont = 0;
        
        if (offset > array.length) {
            console.log("ERROR: Offset is greater than the array size");
            response.sendStatus(400);
        }
        else
            for (var i = offset; i < array.length; i++)
                if (limit > cont) {
                    res.push(array[i]);
                    cont++;
                }
        return res;
    }


// GET a collection
app.get(BASE_API_PATH + "/uclchampions", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    
    //variables busqueda
    var url = request.query;
    var year = url.year;
    var champion = url.champion;
    var runnerup = url.runnerup;
    var stadium = url.stadium;
    var city = url.city;
    
    //variables paginacion
    var limit = parseInt(url.limit);
    var offset = parseInt(url.offset);
    var elementos = [];

    
    if(limit>0 && offset>0){
        console.log("INFO: New GET request to /uclchampions");
        db.find({}).skip(offset).limit(limit).toArray(function(err, uclchampions) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                //console.log("INFO: Sending uclchampions: " + JSON.stringify(uclchampions, 2, null));
                //response.send(uclchampions);
                var filtered = uclchampions.filter((param) => {
                if ((year == undefined || param.year == year) && (champion == undefined || param.champion == champion) && 
                (runnerup == undefined || param.runnerup == runnerup) && (stadium == undefined || param.stadium == stadium) && 
                (city == undefined || param.city == city)) {
                return param;
                }
                });
            }
         
        if (filtered.length > 0) {
           elementos = paginate(offset, limit, filtered, response);
            response.send(elementos);
          }
        else {
           console.log("WARNING: There are not any contact with this properties");
           response.sendStatus(404); // not found
        }
        });
    }else{
        db.find({}).toArray(function(err, uclchampions) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            //console.log("INFO: Sending uclchampions: " + JSON.stringify(uclchampions, 2, null));
            //response.send(uclchampions);
            var filtered = uclchampions.filter((param) => {
            if ((year == undefined || param.year == year) && (champion == undefined || param.champion == champion) && 
            (runnerup == undefined || param.runnerup == runnerup) && (stadium == undefined || param.stadium == stadium) && 
            (city == undefined || param.city == city)) {
            return param;
            }
            });
        }
    if (filtered.length > 0) {
       console.log("INFO: Sending stat: "+ JSON.stringify(filtered, 2, null));
       response.send(filtered);
      }else{
//    if(uclchampions.length >=0){
        response.send(uclchampions);
    }
    //else{
      // console.log("WARNING: There are not any contact with this properties");
       //response.sendStatus(404); // not found
    //}
    });
    }
});

//Funcion paginacion
function insertar (elementos,array,limit,offset){
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
app.get(BASE_API_PATH + "/uclchampions/:year", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
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
    if (!checkApiKeyFunction(request, response)) return;
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
            db.find({}).toArray(function (err, uclchampions) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var uclchampionsBeforeInsertion = uclchampions.filter((uclchampion) => {
                        return (uclchampion.year.localeCompare(newUclchampion.year, "en", {'sensitivity': 'base'}) === 0);
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
    if (!checkApiKeyFunction(request, response)) return;
    var year = request.params.year;
    console.log("WARNING: New POST request to /uclchampions/" + year + ", sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a collection
app.put(BASE_API_PATH + "/uclchampions", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    console.log("WARNING: New PUT request to /uclchampions, sending 405...");
    response.sendStatus(405); // method not allowed
});


//PUT over a single resource
app.put(BASE_API_PATH + "/uclchampions/:year", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var updatedUclchampion = request.body;
    var year = request.params.year;
    if (!updatedUclchampion) {
        console.log("WARNING: New PUT request to /uclchampions/ without uclchampion, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /uclchampions/" + year + " with data " + JSON.stringify(updatedUclchampion, 2, null));
        if(updatedUclchampion.year!=year){
            console.log("WARNING: New PUT request to /uclchampions/ with diferent year, sending 400...");
            response.sendStatus(400); // bad request
        }
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
                        return (uclchampion.year.localeCompare(updatedUclchampion.year, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (uclchampionsBeforeInsertion.length > 0) {
                        db.update({year: year}, updatedUclchampion);
                        console.log("INFO: Modifying uclchampion with year " + year + " with data " + JSON.stringify(updatedUclchampion, 2, null));
                        response.send(updatedUclchampion); // return the updated uclchampion
                    } else {
                        console.log("WARNING: There are not any uclchampion with year " + year);
                        response.sendStatus(400); // not found
                    }
                }
            });
        }
    }
});




//DELETE over a collection
app.delete(BASE_API_PATH + "/uclchampions", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
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
    if (!checkApiKeyFunction(request, response)) return;
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
}