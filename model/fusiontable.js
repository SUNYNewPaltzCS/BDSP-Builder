// Copyright 2012-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var google = require('googleapis');
var fs = require("fs");
var OAuth2Client = google.auth.OAuth2;
var ft = google.fusiontables('v2');
var user = google.oauth2('v2');

// Client ID and client secret are available at
// https://code.google.com/apis/console
var client_secrets = JSON.parse(fs.readFileSync('./client_secrets.json'));
var CLIENT_ID = client_secrets.web.client_id;
var CLIENT_SECRET = client_secrets.web.client_secret;
var REDIRECT_URL = 'http://sunyfusion.me/node-builder/fusiontable/auth';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
google.options({
    auth: oauth2Client
});
var writeRefreshToken = function(email, token) {
	var refresh_tokens = JSON.parse(fs.readFileSync('private/refresh_tokens.json'));
	console.log(refresh_tokens);
	var exists = false;
	for(var i =0; i < refresh_tokens.length; i++) {
		var d = refresh_tokens[i];
		if(d.email === email) {
			console.log(email + " is in there");
			d.token = token;
			exists = true;
		}
	};
	if(!exists) {
		refresh_tokens.push({ 'email': email, 'token':token});
	}
	console.log(JSON.stringify(refresh_tokens));
	var options = { flag : 'w' };
	fs.writeFileSync('private/refresh_tokens.json', JSON.stringify(refresh_tokens), options, function(err) {
		if (err) throw err;
		console.log('file saved');
	});
}
module.exports = {
    blank: function() {
        return {};
    },
    get: function(ret) {
        var url = oauth2Client.generateAuthUrl({
            access_type: 'offline', // will return a refresh token
				//approval_prompt: 'force',
            scope: [
					'https://www.googleapis.com/auth/fusiontables',
					'https://www.googleapis.com/auth/userinfo.email'
				]
					// can be a space-delimited string or an array of scopes
        });
        ret(null, url);
    },
    oauthcallback: function(req, ret) {
	 	  var code = req.query.code;
        oauth2Client.getToken(code, function(err, tokens) {
            if (err) {
                return ret(err, null);
            }
            oauth2Client.setCredentials(tokens);
				user.userinfo.v2.me.get('email', function(err, email) {
					req.session.email = email.email;
					console.log("Email set " + req.session.email);
					req.session.save();
					//writeRefreshToken(email.email,tokens.refresh_token);	
					if("refresh_token" in tokens){ 
						console.log("NEW REFRESH TOKEN");
						writeRefreshToken(email.email,tokens.refresh_token);	
					}
				});
            ft.table.list({}, [], function(err, profile) {
                if (err) {
                    console.log('An error occured', err);
                }
                ret(err, profile);
            });
        });
    },
    setRefreshToken: function(tokens) {
        oauth2Client.setCredentials(tokens);
    },
    tables: function(req,ret) {
		  user.userinfo.v2.me.get('email', function(err, email) {
				req.session.email = email.email;
        });
		  ft.table.list({}, [], function(err, profile) {
            if (err) {
                console.log('An error occured : ', err.message);
            }
            ret(err, profile);
        });
    }
    /*
    columns: function(table,ret) {
        if(!table.kind || table.kind !== 'fusiontables#table') {
            throw(Error('Invalid table in fusiontables.columns'));
        }
        
    }*/
};
