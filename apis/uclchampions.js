var exports = module.exports = {};

exports.register = function(app, db, BASE_API_PATH, checkApiKeyFunction){



//////////////////////INICIALIZAR EL ARRAY///////////////////////////
app.get(BASE_API_PATH + "/uclchampions/loadInitialData", function (request, response){
if(checkApiKeyFunction(request,response)==true){
     var inicializacion = [{
                "year": "2016",
                "champion": "Madrid",
                "runnerup": "Atletico",
                "stadium": "Giuseppe Meazza",
                "city": "Milan"
            },
            {
                "year": "2015",
                "champion": "Barcelona",
                "runnerup": "Juventus",
                "stadium": "Olimpico Berlin",
                "city": "Berlin"
            },
            {
                "year": "2014",
                "champion": "Madrid",
                "runnerup": "Atletico",
                "stadium": "Estadio da Luz",
                "city": "Lisboa"
            },
            {
                "year": "2013",
                "champion": "Bayern",
                "runnerup": "Dortmund",
                "stadium": "Wembley",
                "city": "Londres"
            },
            {
                "year": "2012",
                "champion": "Chelsea",
                "runnerup": "Bayern",
                "stadium": "Arena",
                "city": "Munich"
            },
            {
                "year": "2011",
                "champion": "Barcelona",
                "runnerup": "United",
                "stadium": "Wembley",
                "city": "Londres"
            },
            {
                "year": "2010",
                "champion": "Inter",
                "runnerup": "Bayern",
                "stadium": "Bernabeu",
                "city": "Madrid"
            },
            {
                "year": "2009",
                "champion": "Barcelona",
                "runnerup": "United",
                "stadium": "Olimpico Roma",
                "city": "Roma"
            }];
                 console.log("INFO: Initializing data.");
 //Busca en la base de datos y obtiene un array
            db.find({}).toArray(function(err, uclchampions){
                //Si hay algún error en el servidor, lanzo el error como respuesta.
                if(err){
                    response.sendStatus(500); // internal server error
                }else{
                    //Si hay algun elemento en el array, respondo con que ya hay datos en la DB
                    if(uclchampions.length > 0){
                        console.log('INFO: DB has ' + uclchampions.length + ' results ');
                        response.sendStatus(409);//Already Data
                    }else{
                    //Si no había datos, inserto los datos en la DB
                     db.insert(inicializacion);
                     response.sendStatus(201); //created!
                     console.log("INFO: Data initialized.");
                    }
                }
            });
    }
});


// GET a collection
app.get(BASE_API_PATH + "/uclchampions", function (request, response) {
   if (!checkApiKeyFunction(request, response)) return;
   //if(checkApiKeyFunction(request, response) == true){
       

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

    
    if(limit>0 && offset>=0){
        console.log("INFO: New GET request to /uclchampions");
        db.find({}).skip(offset).limit(limit).toArray(function (err, uclchampions) {
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
            elementos = insertar(filtered, elementos,limit,offset);
            response.send(elementos);
          }
        else {
           console.log("WARNING: There are not any champions with this properties");
           response.sendStatus(404); // not found
        }
        });
    }else{
        db.find({}).toArray(function(err, uclchampions) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
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
        response.send(uclchampions);
    }
        
        
        
    });
   }//}
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


app.get(BASE_API_PATH + "/uclchampions/:year", function (request, response) {
    //if(checkApiKeyFunction(request, response) == true){
    if (!checkApiKeyFunction(request, response)) return;    
    var year = request.params.year;
    if (!year) {
        console.log("WARNING: New GET request to /uclchampions/:year without year, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /uclchampions/" + year);
        db.find({year :year}).toArray(function (err, filtereduclchampions) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                if (filtereduclchampions.length > 0) {
                    var uclchampions = filtereduclchampions[0];
                    console.log("INFO: Sending uclchampions: " + JSON.stringify(uclchampions, 2, null));
                    response.send(uclchampions);
                } else {
                    console.log("WARNING: There are not any contact with player " + year);
                    response.sendStatus(404); // not found
                }
            }
        });
    }//}
});

//POST over a collection 
app.post(BASE_API_PATH + "/uclchampions", function (request, response) {
    //if(checkApiKeyFunction(request, response) == true){
    if (!checkApiKeyFunction(request, response)) return;
    var newuclchampions = request.body;
    if (!newuclchampions) {
        console.log("WARNING: New POST request to /uclchampions/ without uclchampions, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /lfppichichitrophy with body: " + JSON.stringify(newuclchampions, 2, null));
        if (!newuclchampions.year || !newuclchampions.champion || !newuclchampions.runnerup || !newuclchampions.stadium || !newuclchampions.city) {
            console.log("WARNING: The newuclchampions " + JSON.stringify(newuclchampions, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}).toArray(function (err, uclchampions) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var uclchampionsBeforeInsertion = uclchampions.filter((uclchampions) => {
                        return (uclchampions.year.localeCompare(newuclchampions.year, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (uclchampionsBeforeInsertion.length > 0) {
                        console.log("WARNING: The uclchampions " + JSON.stringify(newuclchampions, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding uclchampions " + JSON.stringify(newuclchampions, 2, null));
                        db.insert(newuclchampions);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
    //}
});

//POST over a single resource 
app.post(BASE_API_PATH + "/uclchampions/:year", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    //if(checkApiKeyFunction(request, response) == true){
    var year = request.params.year;
    console.log("WARNING: New POST request to /uclchampions/" + year + ", sending 405...");
    response.sendStatus(405); // method not allowed
    //}
});

//PUT over a collection 
app.put(BASE_API_PATH + "/uclchampions", function (request, response) {
    //if(checkApiKeyFunction(request, response) == true){
    if (!checkApiKeyFunction(request, response)) return;
    console.log("WARNING: New PUT request to /uclchampions, sending 405...");
    response.sendStatus(405); // method not allowed
    //}
});


//PUT over a single resource 
/*app.put(BASE_API_PATH + "/lfppichichitrophy/:season", function (request, response) {
    //if(checkApiKeyFunction(request, response) == true){
    if (!checkApiKeyFunction(request, response)) return;
    var updatedlfppichichitrophy = request.body;
    var season = request.params.season;
    if (!updatedlfppichichitrophy) {
        console.log("WARNING: New PUT request to /lfppichichitrophy/ without lfppichichitrophy, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /lfppichichitrophy/" + season + " with data " + JSON.stringify(updatedlfppichichitrophy, 2, null));
        if(updatedlfppichichitrophy.season!=season){
            console.log("WARNING: New PUT request to /lfppichichitrophy/ with diferent season, sending 400...");
            response.sendStatus(400); // bad request
        }
        if (!updatedlfppichichitrophy.nationality || !updatedlfppichichitrophy.season || !updatedlfppichichitrophy.name || !updatedlfppichichitrophy.team || !updatedlfppichichitrophy.goal) {
            console.log("WARNING: The lfppichichitrophy " + JSON.stringify(updatedlfppichichitrophy, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbd.find({}).toArray(function (err, lfppichichitrophy) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var lfppichichitrophyBeforeInsertion = lfppichichitrophy.filter((lfppichichitrophy) => {
                        return (lfppichichitrophy.season.localeCompare(updatedlfppichichitrophy.season, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (lfppichichitrophyBeforeInsertion.length > 0) {
                        dbd.update({season: season}, updatedlfppichichitrophy);
                        console.log("INFO: Modifying lfppichichitrophy with season " + season + " with data " + JSON.stringify(updatedlfppichichitrophy, 2, null));
                        response.send(updatedlfppichichitrophy); // return the updated lfppichichitrophy
                        response.sendStatus(201);
                    } else {
                        console.log("WARNING: There are not any lfppichichitrophy with season " + season);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    //}
    }
});*/

app.put(BASE_API_PATH + "/uclchampions/:year", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    var updateduclchampions = request.body;
    var year = request.params.year;
    if (!updateduclchampions) {
        console.log("WARNING: New PUT request to /uclchampions/ without uclchampions, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New PUT request to /uclchampions/" + year + " with data " + JSON.stringify(updateduclchampions, 2, null));
        if(updateduclchampions.year!=year){
            console.log("WARNING: New PUT request to /lfppichichitrophy/ with diferent season, sending 400...");
            response.sendStatus(400); // bad request
        }
        if (!updateduclchampions.year || !updateduclchampions.champion || !updateduclchampions.runnerup || !updateduclchampions.stadium || !updateduclchampions.city) {
            console.log("WARNING: The uclchampions " + JSON.stringify(updateduclchampions, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            db.find({}).toArray(function (err, uclchampions) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var uclchampionsBeforeInsertion = uclchampions.filter((uclchampions) => {
                        return (uclchampions.year.localeCompare(updateduclchampions.year, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (uclchampionsBeforeInsertion.length > 0) {
                        db.update({year: year}, updateduclchampions);
                        console.log("INFO: Modifying uclchampions with year " + year + " with data " + JSON.stringify(updateduclchampions, 2, null));
                        response.send(updateduclchampions); // return the updated lfppichichitrophy
                    } else {
                        console.log("WARNING: There are not any uclchampions with year " + year);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});

//DELETE over a collection 
app.delete(BASE_API_PATH + "/uclchampions", function (request, response) {
    //if(checkApiKeyFunction(request, response) == true){
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
                console.log("WARNING: There are no uclchampions to delete");
                response.sendStatus(404); // not found
            }
        }
    });
    //}
});

//DELETE over a single resource
app.delete(BASE_API_PATH + "/uclchampions/:year", function (request, response) {
    //if(checkApiKeyFunction(request, response) == true){
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
                    console.log("INFO: The uclchampions with year " + yearParam + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no uclchampions to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    //}
    }
});


}