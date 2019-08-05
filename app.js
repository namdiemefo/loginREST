var express = require('express');
var app = express();
var logger = require('morgan');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/user');
var authRoutes = require('./routes/auth');



mongoose.connect('mongodb://localhost/laundro', {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.use(authRoutes);

app.listen(process.env.PORT || 4000, process.env.IP, function(){
    console.log('server has begun');
});