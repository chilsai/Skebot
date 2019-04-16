var fs = require('fs');
var packageName = '';

module.exports.retrieveMetadata = function(sfConnection,req,res){  		
	// Single record retrieval
	console.log("id ______" + JSON.stringify(req.body));	
	
	var types = [];
	//var type = [{members:'Account', name:'CustomObject'},{members:'Contact', name:'CustomObject'}];
	types = [{"types" : req.body.metadata}];
	packageName = req.body.PackageName;
	console.log('!@!@!@!@!@!!'+JSON.stringify(types));	
	var wsS = fs.createWriteStream("./package/MyPackage.zip");	
	var zip = sfConnection.metadata.retrieve({ unpackaged: types,
			apiVersion: 36.0
	}).stream();
	zip._read();
	res.json({status:true});
};

module.exports.StoreMetadata = function(conn,zipFile){  		
	console.log('@@@@@@@@@@ in Store Metadata--'+zipFile);	
	conn.sobject("ContentVersion").create({ 
		  title : packageName,
		  versionData : zipFile,
		  pathOnClient : '/foo.zip',
		  TagCsv : 'Skebot'
		  }, function(err, ret) {
		  if (err || !ret.success) { return console.error(err, ret); }
		  console.log("Created record id : " + ret.id); 
	});			
};

