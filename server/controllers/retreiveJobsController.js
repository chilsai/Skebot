var request = require("request");
var fs = require("fs");
var zip = new require('node-zip')()

module.exports.retrieveJobs = function(sfConnection,req,res){  

	/*var options = {
		  url: 'https://ap2.salesforce.com/services/data/v36.0/sobjects/ContentVersion/06828000000vABuAAM/VersionData',
		  headers: {
		    'Authorization': 'Bearer 00D28000001QRgr!ARwAQBadRoW9y0I4JV54JIjwMTXBrMqyuYkjxuZODMjOLD1vdYqPFOm0fW4.0HdpDRSHwYlQFwpk0CKStPA6.riOGl2Fw1eM'
		  },
		  method: "GET",
		  timeout: 10000,
		  followRedirect: true,
		  maxRedirects: 10	
	};	

	function callback(error, response, body) {		  }
	request(options, callback).pipe(fs.createWriteStream('Metadata.zip')).on('close', function () {
		var zipStream = fs.createReadStream("Metadata.zip");
		console.log('File written!' + JSON.stringify(zipStream));
		sfConnection.metadata.deploy(zipStream, { runTests: [ ] })
		  .complete(function(err, result) {
		    fs.unlink("Metadata.zip");
		    if (err) { console.error(err); }else{
			    console.log('done ? :' + result.done);
			    console.log('success ? : ' + result);
			    console.log('state : ' + result.state);
			    console.log('component errors: ' + result.numberComponentErrors);
			    console.log('components deployed: ' + result.numberComponentsDeployed);
			    console.log('tests completed: ' + result.numberTestsCompleted);
			    //fs.unlink("Metadata.zip")			    
		    }
		  });		
	});
	
	sfConnection.tooling.query("SELECT ApexClassOrTrigger.Name, NumLinesCovered, NumLinesUncovered FROM ApexCodeCoverageAggregate ORDER BY ApexClassOrTrigger.Name ASC",function(err, results){
		if (err) { return console.error(err); }
		console.log('Tooling @@@@@@@--'+JSON.stringify(results));
		console.log("Tooling total : " + result.totalSize);
	});	*/
	if(sfConnection){
		var records = [];
		sfConnection.query("select id,title,tagcsv,createdby.name,VersionNumber,createddate,versiondata from contentVersion limit 100", function(err, result) {
		  if (err) { return console.error(err); }
		  console.log("total : " + result.totalSize);
		  console.log("fetched : " + JSON.stringify(result.records));
		  records = result.records;
		  res.json(records);
		});			
	}else{
		console.log('In If else ******');
		res.json([{status:false, code:"1001"}]);
	}		
};