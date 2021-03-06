var exports = module.exports = {};

exports.register = function(app, dbd, BASE_API_PATH, checkApiKeyFunction){



//////////////////////INICIALIZAR EL ARRAY///////////////////////////
app.get(BASE_API_PATH + "/lfppichichitrophy/loadInitialData", function (request, response){
if(checkApiKeyFunction(request,response)==true){
     var inicializacion = [{"nationality":"argentina","season":"2011-12","name":"messi","team":"fcb barcelona","goal":"50"},
                {"nationality": "portuguese", "season": "2013-14", "name":"cristiano ronaldo", "team": "real madrid", "goal": "31"},
                { "nationality": "brazilian", "season": "2003-04", "name":"ronaldo", "team": "real madrid", "goal": "24"}];
                 console.log("INFO: Initializing data.");
 //Busca en la base de datos y obtiene un array
            dbd.find({}).toArray(function(err, lfppichichitrophy){
                //Si hay algún error en el servidor, lanzo el error como respuesta.
                if(err){
                    response.sendStatus(500); // internal server error
                }else{
                    //Si hay algun elemento en el array, respondo con que ya hay datos en la DB
                    if(lfppichichitrophy.length > 0){
                        console.log('INFO: DBD has ' + lfppichichitrophy.length + ' results ');
                        response.sendStatus(409);//Already Data
                    }else{
                    //Si no había datos, inserto los datos en la DB
                     dbd.insert(inicializacion);
                     response.sendStatus(201); //created!
                     console.log("INFO: Data initialized.");
                    }
                }
            });
    }
});


// GET a collection
app.get(BASE_API_PATH + "/lfppichichitrophy", function (request, response) {
   if (!checkApiKeyFunction(request, response)) return;
   //if(checkApiKeyFunction(request, response) == true){
       

 //variables busqueda
    var url = request.query;
    var nationality = url.nationality;
    var season = url.season;
    var name = url.name;
    var team = url.team;
    var goal = url.goal;
    
    //variables paginacion
    var limit = parseInt(url.limit);
    var offset = parseInt(url.offset);
    var elementos = [];

    
    if(limit>0 && offset>=0){
        console.log("INFO: New GET request to /lfppichichitrophy");
        dbd.find({}).skip(offset).limit(limit).toArray(function (err, lfppichichitrophy) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                //console.log("INFO: Sending lfppichichitrophy: " + JSON.stringify(lfppichichitrophy, 2, null));
                //response.send(lfppichichitrophy);
                 var filtered = lfppichichitrophy.filter((param) => {
                if ((nationality == undefined || param.nationality == nationality) && (season == undefined || param.season == season) && 
                (name == undefined || param.name == name) && (team == undefined || param.team == team) && 
                (goal == undefined || param.goal == goal)) {
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
        dbd.find({}).toArray(function(err, lfppichichitrophy) {
        if (err) {
            console.error('WARNING: Error getting data from DB');
            response.sendStatus(500); // internal server error
        } else {
            var filtered = lfppichichitrophy.filter((param) => {
            if ((nationality == undefined || param.nationality == nationality) && (season == undefined || param.season == season) && 
                (name == undefined || param.name == name) && (team == undefined || param.team == team) && 
                (goal == undefined || param.goal == goal)) {
            return param;
            }
        });
        }
        
    if (filtered.length > 0) {
        console.log("INFO: Sending stat: "+ JSON.stringify(filtered, 2, null));
        response.send(filtered);
    }else{
        response.send(lfppichichitrophy);
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


app.get(BASE_API_PATH + "/lfppichichitrophy/:season", function (request, response) {
    //if(checkApiKeyFunction(request, response) == true){
    if (!checkApiKeyFunction(request, response)) return;    
    var season = request.params.season;
    if (!season) {
        console.log("WARNING: New GET request to /lfppichichitrophy/:season without season, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New GET request to /lfppichichitrophy/" + season);
        dbd.find({season :season}).toArray(function (err, filteredlfppichichitrophy) {
            if (err) {
                console.error('WARNING: Error getting data from DB');
                response.sendStatus(500); // internal server error
            } else {
                if (filteredlfppichichitrophy.length > 0) {
                    var lfppichichitrophy = filteredlfppichichitrophy[0];
                    console.log("INFO: Sending lfppichichitrophy: " + JSON.stringify(lfppichichitrophy, 2, null));
                    response.send(lfppichichitrophy);
                } else {
                    console.log("WARNING: There are not any contact with player " + season);
                    response.sendStatus(404); // not found
                }
            }
        });
    }//}
});

//POST over a collection 
app.post(BASE_API_PATH + "/lfppichichitrophy", function (request, response) {
    //if(checkApiKeyFunction(request, response) == true){
    if (!checkApiKeyFunction(request, response)) return;
    var newlfppichichitrophy = request.body;
    if (!newlfppichichitrophy) {
        console.log("WARNING: New POST request to /lfppichichitrophy/ without lfppichichitrophy, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New POST request to /lfppichichitrophy with body: " + JSON.stringify(newlfppichichitrophy, 2, null));
        if (!newlfppichichitrophy.nationality || !newlfppichichitrophy.season || !newlfppichichitrophy.name || !newlfppichichitrophy.team || !newlfppichichitrophy.goal) {
            console.log("WARNING: The newlfppichichitrophy " + JSON.stringify(newlfppichichitrophy, 2, null) + " is not well-formed, sending 422...");
            response.sendStatus(422); // unprocessable entity
        } else {
            dbd.find({}).toArray(function (err, lfppichichitrophy) {
                if (err) {
                    console.error('WARNING: Error getting data from DB');
                    response.sendStatus(500); // internal server error
                } else {
                    var lfppichichitrophyBeforeInsertion = lfppichichitrophy.filter((lfppichichitrophy) => {
                        return (lfppichichitrophy.season.localeCompare(newlfppichichitrophy.season, "en", {'sensitivity': 'base'}) === 0);
                    });
                    if (lfppichichitrophyBeforeInsertion.length > 0) {
                        console.log("WARNING: The lfppichichitrophy " + JSON.stringify(newlfppichichitrophy, 2, null) + " already extis, sending 409...");
                        response.sendStatus(409); // conflict
                    } else {
                        console.log("INFO: Adding lfppichichitrophy " + JSON.stringify(newlfppichichitrophy, 2, null));
                        dbd.insert(newlfppichichitrophy);
                        response.sendStatus(201); // created
                    }
                }
            });
        }
    }
    //}
});

//POST over a single resource 
app.post(BASE_API_PATH + "/lfppichichitrophy/:season", function (request, response) {
    if (!checkApiKeyFunction(request, response)) return;
    //if(checkApiKeyFunction(request, response) == true){
    var season = request.params.season;
    console.log("WARNING: New POST request to /lfppichichitrophy/" + season + ", sending 405...");
    response.sendStatus(405); // method not allowed
    //}
});

//PUT over a collection 
app.put(BASE_API_PATH + "/lfppichichitrophy", function (request, response) {
    //if(checkApiKeyFunction(request, response) == true){
    if (!checkApiKeyFunction(request, response)) return;
    console.log("WARNING: New PUT request to /lfppichichitrophy, sending 405...");
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

app.put(BASE_API_PATH + "/lfppichichitrophy/:season", function (request, response) {
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
                    } else {
                        console.log("WARNING: There are not any lfppichichitrophy with season " + season);
                        response.sendStatus(404); // not found
                    }
                }
            });
        }
    }
});

//DELETE over a collection 
app.delete(BASE_API_PATH + "/lfppichichitrophy", function (request, response) {
    //if(checkApiKeyFunction(request, response) == true){
    if (!checkApiKeyFunction(request, response)) return;
    
    console.log("INFO: New DELETE request to /lfppichichitrophy");
    dbd.remove({},{multi: true}, function (err, result) {
        var numRemoved = JSON.parse(result);
        if (err) {
            console.error('WARNING: Error removing data from DB');
            response.sendStatus(500); // internal server error
        } else {
            if (numRemoved.n> 0) {
                console.log("INFO: All the lfppichichitrophy (" + numRemoved + ") have been succesfully deleted, sending 204...");
                response.sendStatus(204); // no content
            } else {
                console.log("WARNING: There are no contacts to delete");
                response.sendStatus(404); // not found
            }
        }
    });
    //}
});

//DELETE over a single resource
app.delete(BASE_API_PATH + "/lfppichichitrophy/:season", function (request, response) {
    //if(checkApiKeyFunction(request, response) == true){
    if (!checkApiKeyFunction(request, response)) return;
    var seasonParam = request.params.season;
    if (!seasonParam) {
        console.log("WARNING: New DELETE request to /lfppichichitrophy/:season without season, sending 400...");
        response.sendStatus(400); // bad request
    } else {
        console.log("INFO: New DELETE request to /lfppichichitrophy/" + seasonParam);
        dbd.remove({season:seasonParam},{},function (err, result) {
            var numRemoved = JSON.parse(result);
            if (err) {
                console.error('WARNING: Error removing data from DB');
                response.sendStatus(500); // internal server error
            } else {
                console.log("INFO: lfppichichitrophy removed: " + numRemoved);
                if (numRemoved.n === 1) {
                    console.log("INFO: The lfppichichitrophy with season " + seasonParam + " has been succesfully deleted, sending 204...");
                    response.sendStatus(204); // no content
                } else {
                    console.log("WARNING: There are no contacts to delete");
                    response.sendStatus(404); // not found
                }
            }
        });
    //}
    }
});


}