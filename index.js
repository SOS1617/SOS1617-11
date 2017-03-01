var express = require("express");
var date = require("fecha");

var port = (process.env.PORT || 16778); /*Si esta definida port se coge port, sino el puerto que queramos*/

var app = express();




app.get("/time",(req,res) =>{
    res.send("<html><body><h1>" + date.format(new Date(Date.now()),'Do MMMM [of] YYYY [,] HH:mm:ss') + "</h1></body></html>");
});


app.get("/", (req, res) => {
    res.send("<html><body><h1><a href=/time>/time</a></h1></body><html>");
});

app.listen(port,(err) => {
    if(!err)
        console.log("Server inicialized on port: "+port);
    else
        console.log("ERROR inicializing server on port: "+port+ ": "+err);
});