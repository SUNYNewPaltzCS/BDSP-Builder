module.exports = {
	blank: function() { return {} },
	post: function(table, ret) {
		var buildApp = [];
		var currentStr = "";
		buildApp.push("table " + table.name); //add table name
		buildApp.push("id " +  table.id ); //add table name
		table.columns.forEach(function(col) {
			var currentStr = "";
			currentStr = col.inputType + " " + col.name;
			buildApp.push(currentStr);
		});
		buildApp.push("endFile");
		console.log(buildApp);	
		ret(0, "hello");
	}
};
