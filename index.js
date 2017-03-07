var express = require("express");
var date = require("fecha");
var path = require("path");

var app = express();
var port = (process.env.PORT || 16778);



app.use("/",express.static( path.join( __dirname,"public")));

app.get("/time",(req,res) =>{
    res.send("<html><body><h1>" + date.format(new Date(Date.now()),'Do MMMM [of] YYYY [,] HH:mm:ss') + "</h1></body></html>");
});


/*app.get("/", (req, res) => {
    res.send("<html><body><h1><a href=/time>/time</a></h1></body><html>");
});
*/
app.listen(port,() => {
        console.log("Server inicialized on port: "+port);
}).on("error",(e) =>{
    console.log("ERROR inicializing server on port: "+port+ ": "+e);
    process.exit(1);
});