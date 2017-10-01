var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var BD = require('./app/models/MonitoriaApiModel'); //created model loading here

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');    // Setamos que nossa engine será o ejs

var routes = require('./app/routes/MonitoriaApiRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('Monitoria Ufla RESTful API server started on: ' + port);
