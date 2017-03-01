var express = require("express");
var date = require("fecha");

var port = (process.env.PORT || 16778); /*Si esta definida port se coge port, sino el puerto que queramos*/

var app = express();
var dateNow = new Date(Date.now())
dateNow.setHours(dateNow.getHours()+1);



app.get("/time",(req,res) =>{
    res.send("<html><body><h1>" + date.format(dateNow,'Do MMMM [of] YYYY [,] HH:mm:ss') + "</h1></body></html>");
});

app.listen(port,(err) => {
    if(!err)
        console.log("Server inicialized on port: "+port);
    else
        console.log("ERROR inicializing server on port: "+port+ ": "+err);
});