
module.exports.getMetaData = function(sfConnection,req,res){  	
	console.log('iin metada ret**'+sfConnection);
	if(sfConnection){
		sfConnection.metadata.describe('36', function(err, results) {	
			var arry = getMetadataList(results);
			console.log('in If ******'+results);
			res.json(arry);	
		});			
	}else{
		console.log('in If else ******');
		res.json([{status:false, code:"1001"}]);
	}	
};

var getMetadataList = function(results){
	var metadatArray = [];
	if(results){
		for(var i = 0;i < results.metadataObjects.length;i++){
			var xmlName = results.metadataObjects[i].xmlName;
			var directoryName = results.metadataObjects[i].directoryName;
			var childXmlNames = results.metadataObjects[i].childXmlNames;
			var childTags = '';
			if(childXmlNames){
				if(childXmlNames && childXmlNames.length > 0){		
					for(var y = 0;y < childXmlNames.length;y++){
						if(childTags == ''){
							childTags = childXmlNames[y];
							metadatArray.push({selected:false,name:childXmlNames[y],directoryName:directoryName});
						}
					}			
				}				
			}
			metadatArray.push({selected:false,name:xmlName,directoryName:directoryName});
		}
		console.log('@@@@@@@@@@@'+metadatArray);
		return metadatArray;
	}	
} 