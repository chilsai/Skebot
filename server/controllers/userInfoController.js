
module.exports.getUserInformation = function(sfConnection,req,res){  		
	// Single record retrieval
	console.log("id ______" + sfConnection.userInfo.id);
	var records = [];
	sfConnection.query("SELECT Id, Name,firstname,email,username FROM user where id = '"+sfConnection.userInfo.id+"'", function(err, result) {
	  if (err) {
		  return console.error(err); 
	  }
	  console.log("total : " + result.totalSize);
	  console.log("fetched : " + result.records);
	  records.push({userInfo:result.records[0],sessionId:sfConnection.accessToken,instanceUrl: sfConnection.instanceUrl});
	  res.json(records);
	});	
};