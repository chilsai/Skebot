
module.exports.getComponentData = function(sfConnection,req,res){  	
	
	var ListMetadataQuery = [];
	//var MetadataQuery = {type:"ApexClass",folder:""};
	ListMetadataQuery = getMetadataQuery(req.body);
	console.log('ListMetadataQuery--%%%%%4' + ListMetadataQuery);
	sfConnection.metadata.list(ListMetadataQuery,'36', function(err, results) {		
		var listMetadata = [];
		//console.log('SDSSSS********'+results.length);
		if(results){
			for(var i=0;i<results.length;i++){						
				console.log('SDSSSS********'+results[i].fullName);
				listMetadata.push({selected:false,
								   fullName:results[i].fullName,
								   createdByName:results[i].createdByName,
								   lastModifiedByName:results[i].lastModifiedByName,
								   type:results[i].type
				});
			}		
			res.json({complist:listMetadata});			
		}else{
			res.json({status:"Failed to Process Request",code:"1001"});
		}		
	});	
};

var getMetadataQuery = function(objArray){
	var ListMetadataQuery = [];	
	console.log('@@@@@@@@'+JSON.stringify(objArray));		
	for(var i=0;i<objArray.metadata.length;i++){		
		var MetadataQuery = {type:objArray.metadata[i],folder:""};
		ListMetadataQuery.push(MetadataQuery);	
		console.log('SSSSSSSSSSSSSSSAAAAA'+ListMetadataQuery);
	}	
	return ListMetadataQuery;
}