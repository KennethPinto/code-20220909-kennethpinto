var express = require("express");
    
let app = express();
let port = 3000;

app.get("/", function(req, res) {
    res.send("App Works!");
});

app.listen(port, function(err) {
     console.log(`Running server on port: ${port}`);
});