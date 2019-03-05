var express = require('express');
var app = express();
var handlebars = require('express-handlebars');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var databaseHelper = require('./databasehelper');

var PORT = 3000;



app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(function(req,res,next){
    if (req.cookies.username == null && req.body.username == null)
    {
        res.render('login', {'error': 'user must be logged in'});
    }
    else 
        next();
});
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
var db = new databaseHelper();


app.get('/', function(req,res){
    res.render('index', {'username': req.cookies.username});
});

app.get('/login', function(req,res){
    res.render('login');
});

app.post('/login', async function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    if (username == null || password == null)
    {
        res.render('login', {'error' : 'username and password must be given'});
        return;
    }

    var success = await db.authenticate(username, password);
    console.log('success is ' + success);
    if (success)
    {
        res.cookie('username', username);
        res.redirect('/');
    }
    else
    {
        res.render('login', {'error' : 'username or password do not match'});
    }

});

app.get('/sql', function(req,res){
    res.render('sql', {'username': req.cookies.username});
});

app.post('/sqlresults', async function(req,res){
    var query = req.body.query;
    var results = await db.query(query);
    console.log(results[0]);
    res.render('sqlresults', {'results' : results, 'username': req.cookies.username});
});

app.listen(PORT).on('listening', () => console.log('Listening on port ' + PORT));

