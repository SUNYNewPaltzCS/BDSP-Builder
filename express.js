var PORT_NUMBER = 8080;
var express = require('express'),
    app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fusiontable = require('./model/fusiontable.js');
console.log(__dirname + '/public');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'Ralph The Turtle',
    resave: true,
    saveUninitialized: true,
}));
var site = "http://sunyfusion.me:8080";
app.get("/fusiontable", function(req, res) {
        fusiontable.get(function(err, rows) {
            res.send(rows);
        });
    })
    .get("/fusiontable/auth", function(req, res) {
        fusiontable.oauthcallback(req.query.code, function(err, rows) {
            if (err != null) {
                req.session.loggedIn = true;
            }
            req.session.loggedIn = true;
            res.writeHead(301, {
                Location: site
            });
            res.end();
        });
    })
    .get("/fusiontable/table", function(req, res) {
        if (req.session.loggedIn) {
            fusiontable.tables(function(err, rows) {
                res.send(rows);
            });
        }
		else {
			fusiontable.get(function(err, rows) {
				res.send("NOT LOGGED IN");
			});     
		}
    });
app.listen(PORT_NUMBER);
