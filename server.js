const express = require('express');
const bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var BD = require('./app/models/MonitoriaApiModel'); //created model loading here

//  mongoose instance connection url connection
mongoose.connect('mongodb://pipoca:123456@ds141464.mlab.com:41464/api_monitoria', function(err) {
//mongoose.connect('mongodb://localhost/MonitoriaUflaDB', function(err) {
  if (err) {
    console.log('connection error', err);
  }
  else {
    console.log('connection with database successful');
  }
});

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open');
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', [__dirname + '/app/views',
                  __dirname + '/app/views/index', 
                  __dirname + '/app/views/adm',
                  __dirname + '/app/views/edicao',
                  __dirname + '/app/views/atividades']);
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');    // Setamos que nossa engine será o ejs

var routes = require('./app/routes/MonitoriaApiRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('Monitoria Ufla RESTful API server started on: ' + port);
