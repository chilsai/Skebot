var request = require("request");

module.exports.GetCodeCoverage = function(sfConnection,req,res){  

	if(sfConnection){
		var records = [];
		sfConnection.tooling.query("SELECT ApexClassOrTriggerId,ApexClassOrTrigger.Name, NumLinesCovered, NumLinesUncovered FROM ApexCodeCoverageAggregate ORDER BY ApexClassOrTrigger.Name ASC",function(err, results){
			if (err) { return console.error(err); }
			console.log('Tooling @@@@@@@--'+JSON.stringify(results));
			console.log("Tooling total : " + results.totalSize);
			records = results.records;
			res.json(records);			
		});				
	}else{
		console.log('In If else ******');
		res.json([{status:false, code:"1001"}]);
	}		
};