var jsforce = require('jsforce');
var fs = require("fs");
var request = require("request");

var user = {};
var oauth2;
var sfDeployConn ;

module.exports.Login = function(req,res){
	console.log('@@@@@@@@@@@@@----8 login deploy-'+JSON.stringify(req.body));		
	var env = req.body.environment;
	var username = req.body.username;
	var password = req.body.password;
	if(env == 'Production'){	
		sfDeployConn = new jsforce.Connection({
			loginUrl : 'https://login.salesforce.com'
		});
		console.log('@@@@----14--');
	}else{
		sfDeployConn = new jsforce.Connection({
			loginUrl : 'https://test.salesforce.com'
		});			
		console.log('@@@@----18--');
	}	
	sfDeployConn.login(username, password, function(err, userInfo) {
		  if (err) {  
		  	res.json({status:false,errorMessage: "Authentication Failure"});
		  }else{
			  // Now you can get the access token and instance URL information.
			  // Save them to establish connection next time.
			  console.log(sfDeployConn.accessToken);
			  console.log(sfDeployConn.instanceUrl);
			  // logged in user property
			  console.log("User ID: " + userInfo.id);
			  console.log("Org ID: " + userInfo.organizationId);

			  res.json({status:true,accesstoken:sfDeployConn.accessToken});			  
		  }
	 });		
};

module.exports.Deploy = function(sourceConn,req,res){
	var recordId = req.body.recordId;
	console.log('@@@@@@@@@@@@@@@@@'+JSON.stringify(req.body));
	sourceConn.sobject("ContentVersion").retrieve(recordId, function(err, record) {
		  if (err) { return console.error(err); }
		  console.log("body : " + JSON.stringify(record));	  
		  if(record){
			  var endPointurl = sourceConn.instanceUrl+record.VersionData;
			  var options = {
					  url: endPointurl,
					  headers: {
					    'Authorization': 'Bearer '+sourceConn.accessToken
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
					sfDeployConn.metadata.deploy(zipStream, { runTests: [ ],checkOnly: false,rollbackOnError: true })
					  .complete(function(err, result) {
					    fs.unlink("Metadata.zip");
					    if (err) { console.error(err); }else{
						    console.log('done ? :' + result.done);
						    console.log('success ? : ' + result);
						    console.log('state : ' + result.state);
						    console.log('component errors: ' + result.numberComponentErrors);
						    console.log('components deployed: ' + result.numberComponentsDeployed);
						    console.log('tests completed: ' + result.numberTestsCompleted);
						    res.json(result);
					    }
					  });		
				});			  
		  }
		  
	});
};

