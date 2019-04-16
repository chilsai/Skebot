app.service('MetadataTypes', function() {
  var metaDataTypeList = [];
  
  var getMetadataList = function(){
      return metaDataTypeList;
  };

  var assignMetada = function(metaArray){
	  metaDataTypeList = metaArray;
  }

  return {
	assignMetada: assignMetada,	  
	getMetadataList: getMetadataList
  };

});