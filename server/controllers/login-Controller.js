var jsforce = require('jsforce');
var metadataController = require('./metadataListController');
var componentController = require('./componentListController');
var userInfoController = require('./userInfoController');
var retrieveController = require('./retrieveController');
var retrieveJobsController = require('./retreiveJobsController');
var deployController = require('./deploy-Controller.js');
var testCoverageController = require('./TestCoverageController.js');

var user = {};

var oauth2;
var sfConn ;
module.exports.Login = function(req,res){
	var env = req.params.envmnt;	
	if(env == 'prod'){		
		oauth2 = new jsforce.OAuth2({
			  // you can change loginUrl to connect to sandbox or prerelease env.
			  loginUrl : 'https://login.salesforce.com',	
			  clientId : '3MVG9ZL0ppGP5UrD1UZsWhi6ZW.a32rKEO0QGDYw7Yod8BvtJKl1X8e5qH_f4wonGFxM0GHaISdTVeG3sSGzh',
			  clientSecret : '2238836961341997359',
			  redirectUri : 'https://skebot.herokuapp.com/login/oauth2/callback'
		});	
	}else{		
		oauth2 = new jsforce.OAuth2({
			  // you can change loginUrl to connect to sandbox or prerelease env.
			  loginUrl : 'https://test.salesforce.com',	
			  clientId : '3MVG9ZL0ppGP5UrD1UZsWhi6ZW.a32rKEO0QGDYw7Yod8BvtJKl1X8e5qH_f4wonGFxM0GHaISdTVeG3sSGzh',
			  clientSecret : '2238836961341997359',
			  redirectUri : 'https://skebot.herokuapp.com/login/oauth2/callback'
		});	
	}
	res.redirect(oauth2.getAuthorizationUrl({ scope : 'api id web' }));
};


module.exports.authorizeAndCallBack = function(req,res){
	  sfConn = new jsforce.Connection({ oauth2 : oauth2 });
	  var code = req.param('code');
	  sfConn.authorize(code, function(err, userInfo) {
	    if (err) { return console.error('error :'+err); }
	    // Now you can get the access token, refresh token, and instance URL information.
	    // Save them to establish connection next time.
	    console.log(sfConn.accessToken);
	    console.log(sfConn.refreshToken);
	    console.log(sfConn.instanceUrl);
	    console.log("User ID: " + userInfo.id);
	    console.log("Org ID: " + userInfo.organizationId);
	    user.accessToken = sfConn.accessToken;
		user.Id = userInfo.id;
		user.organizationId = userInfo.organizationId;	 						
		res.redirect('/home');		
	});	  	
};


module.exports.retrieveJobs = function(req,res){	
	retrieveJobsController.retrieveJobs(sfConn,req,res);
};

module.exports.fetchMetadata = function(req,res){	
	metadataController.getMetaData(sfConn,req,res);
};

module.exports.fetchComponents = function(req,res){	
	componentController.getComponentData(sfConn,req,res);
};

module.exports.getUserInfo = function(req,res){	
	userInfoController.getUserInformation(sfConn,req,res);
};


module.exports.retrieve = function(req,res){	
	retrieveController.retrieveMetadata(sfConn,req,res);
};

module.exports.StoreRetrieveMetadata = function(zipFile){  		
	retrieveController.StoreMetadata(sfConn,zipFile);
};

module.exports.Deploy = function(req,res){  		
	deployController.Deploy(sfConn,req,res);
};

module.exports.getCoverage = function(req,res){  		
	testCoverageController.GetCodeCoverage(sfConn,req,res);
};

