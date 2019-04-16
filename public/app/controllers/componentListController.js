app.controller('ComponentListController',['$scope','$resource','$location','$window','$rootScope','$routeParams','$filter','MetadataTypes','ComponentListService',
                                          function($scope,$resource,$location,$window,$rootScope,$routeParams,$filter,MetadataTypes,ComponentListService) {
				
		
		var sortingOrder = 'fullname'; //default sort
		$scope.packageName = '';
		$scope.pageErrorMessage = '';

		$scope.loading = false;
		function initApp(metaData) {
		 
		  // init
		  $scope.sortingOrder = sortingOrder;
		  $scope.pageSizes = [5,10,25];
		  $scope.reverse = false;
		  $scope.filteredItems = [];
		  $scope.groupedItems = [];
		  $scope.itemsPerPage = 10;
		  $scope.pagedItems = [];
		  $scope.currentPage = 0;
		  //$scope.items = generateData();
		  $scope.items = metaData;

		  var searchMatch = function (haystack, needle) {
		    if (!needle) {
		      return true;
		    }		    
		    haystack = String(haystack);
		    return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
		  };
		  
		  // init the filtered items
		  $scope.search = function () {
		    $scope.filteredItems = $filter('filter')($scope.items, function (item) {
		      for(var attr in item) {
		        if (searchMatch(item[attr], $scope.query))
		          return true;
		      }
		      return false;
		    });
		    // take care of the sorting order
		    if ($scope.sortingOrder !== '') {
		      $scope.filteredItems = $filter('orderBy')($scope.filteredItems, $scope.sortingOrder, $scope.reverse);
		    }
		    $scope.currentPage = 0;
		    // now group by pages
		    $scope.groupToPages();
		  };
		  
		  // show items per page
		  $scope.perPage = function () {
		    $scope.groupToPages();
		  };
		  
		  // calculate page in place
		  $scope.groupToPages = function () {
		    $scope.pagedItems = [];
		    
		    for (var i = 0; i < $scope.filteredItems.length; i++) {
		      if (i % $scope.itemsPerPage === 0) {
		        $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.filteredItems[i] ];
		      } else {
		        $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.filteredItems[i]);
		      }
		    }
		  };
		  
		   $scope.deleteItem = function (idx) {
		        var itemToDelete = $scope.pagedItems[$scope.currentPage][idx];
		        var idxInItems = $scope.items.indexOf(itemToDelete);
		        $scope.items.splice(idxInItems,1);
		        $scope.search();
		        
		        return false;
		    };
		  
		  $scope.range = function (start, end) {
		    var ret = [];
		    if (!end) {
		      end = start;
		      start = 0;
		    }
		    for (var i = start; i < end; i++) {
		      ret.push(i);
		    }
		    return ret;
		  };
		  
		  $scope.prevPage = function () {
		    if ($scope.currentPage > 0) {
		      $scope.currentPage--;
		    }
		  };
		  
		  $scope.nextPage = function () {
		    if ($scope.currentPage < $scope.pagedItems.length - 1) {
		      $scope.currentPage++;
		    }
		  };

		  $scope.lastPage = function () {			    
			  $scope.currentPage = $scope.pagedItems.length - 1;
		  };

		  $scope.firstPage = function () {			    
			  $scope.currentPage = 0;
		  };	
		  
		  $scope.setPage = function () {
		    $scope.currentPage = this.n;
		  };
		  
		  // functions have been describe process the data for display
		  $scope.search();
		 
		  
		  // change sorting order
		  $scope.sort_by = function(newSortingOrder) {
		    if ($scope.sortingOrder == newSortingOrder)
		      $scope.reverse = !$scope.reverse;
		    
		    $scope.sortingOrder = newSortingOrder;
		  };

		};	
		
		$scope.selectedTypes = MetadataTypes.getMetadataList();
		$scope.selectedComponentTypes = [];
		console.log('WWWWWW');
		if($scope.selectedComponentTypes.length == 0 && $scope.selectedTypes.length == 0){			
			$location.path('/retreivehome');
		}else{
			$scope.selectedComponentTypes = $scope.selectedTypes;
			console.log('WWWWWW');
			$scope.loading = true;
			var componentList = $resource('/api/fetchMetadataTypes/componentList');
			var seletedMeta = new componentList();		
			console.log('!!!!!!'+$scope.selectedComponentTypes.length);
			seletedMeta.metadata = $scope.selectedComponentTypes;
			var re = seletedMeta.$save(function(results) {
				  console.log('DE result---'+angular.toJson(results.complist, true));
				  if(results.complist){
					  initApp(results.complist);  
				  }				  
				  $scope.loading = false;
			});
		}				
		
		$scope.selectedComponents = [];		
		$rootScope.findSelectedComponents = function(){		
			console.log('!!!@@@@@@@@@@@###'+$scope.packageName);
			if($scope.packageName !== ''){
				$scope.selectedComponents = [];			
				for(var i=0;i<$scope.items.length;i++){
					if($scope.items[i].selected){
						$scope.selectedComponents.push({"members":$scope.items[i].fullName,"name":$scope.items[i].type});	
					}				
				}			
				console.log('!!!!!!!!!!!!!!!!!!!!'+angular.toJson($scope.selectedComponents));
				if($scope.selectedComponents.length > 0){
					//ComponentListService.assignComponents($scope.selectedComponents);
					var componentList = $resource('/api/retrieve');
					var seletedMeta = new componentList();					
					seletedMeta.metadata = $scope.selectedComponents;
					seletedMeta.PackageName = $scope.packageName;
					var re = seletedMeta.$save(function(results) {
						  console.log('DE result---'+angular.toJson(results, true));
					});			
					$location.path('/home' );					
				}else{
					$scope.pageErrorMessage = 'Please select atleast one Component';
				}
			}else{
				console.log('@@@@@@@@@@@@@@@@@@@'+$scope.pageErrorMessage);
				$scope.pageErrorMessage = 'Package Name is Required';
			}
		}				
}]);	

