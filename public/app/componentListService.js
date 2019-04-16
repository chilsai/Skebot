app.service('ComponentListService', function() {
  var ComponentList = [];
  
  var getComponentList = function(){
      return ComponentList;
  };

  var assignComponents = function(metaArray){
	  ComponentList = metaArray;
  }

  return {
	assignComponents: assignComponents,	  
	getComponentList: getComponentList
  };

});