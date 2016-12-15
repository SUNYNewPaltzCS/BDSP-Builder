var fs = require('fs');	
var exec = require('child_process').execSync;


module.exports = {
	blank: function() { return {} },
	post: function(req, ret) {
		var table = req.body;
		var buildApp = [];
		var currentStr = "";
		buildApp.push("table " + table.name); //add table name
		buildApp.push("id " +  table.id ); //add table name
		buildApp.push("url http://www.sunyfusion.me/ft_test/");
		buildApp.push("email " + req.session.email);
		console.log(req.session.email);
		//buildApp.push("email simonsj@newpaltz.edu");
		table.columns.forEach(function(col) {
			var currentStr = "";
			if(col.inputType === 'unused') {
				
			}
			else if(col.inputType === 'run') {
				currentStr = col.inputType + " 1 " + col.name;
				buildApp.push(currentStr);
			}
			else if(col.inputType === 'dropdown') {
				currentStr = col.inputType + " " + col.name + " [" + col.ddoptions.replace(/\s/g, "") + "]";
				buildApp.push(currentStr);
			}
			else if(col.inputType === 'gpsTracker') {
				currentStr = col.inputType + " 1 " + col.name + " " + col.gpsInterval + " start end";
				buildApp.push(currentStr);
			}
			else {
				currentStr = col.inputType + " " + col.name;
				buildApp.push(currentStr);
			}
		});
		buildApp.push("endFile");
		var buildString = "";
		buildApp.forEach(function(line) {
			buildString += line + "\n";
		});
		fs.writeFileSync("buildApp.txt", buildString);
		function puts(error, stdout, stderr) { console.log(stdout) }
		exec("./build_apk.sh apk/app-latest.apk public/downloads/app-built.apk buildApp.txt", puts);
		ret(0, "app-built.apk");
	}
};
