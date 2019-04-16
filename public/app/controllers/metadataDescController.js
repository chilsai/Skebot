app.controller('MetadataListController',['$scope','$resource','$location','$window','$rootScope','$routeParams','$filter','MetadataTypes',
                                 function($scope,$resource,$location,$window,$rootScope,$routeParams,$filter,MetadataTypes) {
		//function($scope, $filter,$resource,$routeParams,$window,$rootScope,$location){

		var sortingOrder = 'name'; //default sort

		$scope.loading = false;
		$scope.pageErrorMessage = '';	
		
		function initApp(metaData) {
		 
		  // init
		  $scope.sortingOrder = sortingOrder;
		  $scope.pageSizes = [8,15,20];
		  $scope.reverse = false;
		  $scope.filteredItems = [];
		  $scope.groupedItems = [];
		  $scope.itemsPerPage = 8;
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
		
		if(!$window.sessionStorage.getItem('skbotuserinfo')){
			var userInfo = $resource('/api/fetchUserInfo');
			var userInfo = userInfo.query(function(){		
				console.log('In SSS Error usinfi'+angular.toJson(userInfo, true));
				if(userInfo[0]){
					$window.sessionStorage.setItem('skebotuserinfo',userInfo[0]);	
				}else{
					$location.path('/');
				}				
			});
		}
		
		var sfAuth = $resource('/api/fetchMetadataTypes');
		$scope.loading = true;
		console.log('Optimize ------'+angular.toJson($scope.items));
		var metaData = sfAuth.query(function(){			
			console.log('DDDDDDDDDD'+angular.toJson(metaData));
			console.log('DDDDDDDDDD'+metaData.length);
			if(!metaData || metaData === 'undefined' || metaData.length == 0 || metaData[0].status === false){
				$window.sessionStorage.removeItem('skbotuserinfo');
				$location.path('/');				
			}else{
				console.log('DDDDDDDDDD SSSSS');
				initApp(metaData);					
			}
			$scope.loading = false;
		});
		
		$scope.selectedTypes = [];
		$rootScope.findSelected = function(){
			if($scope.packageName != ''){
				$scope.selectedTypes = [];			
				for(var i=0;i<$scope.items.length;i++){
					if($scope.items[i].selected){
						$scope.selectedTypes.push($scope.items[i].name);	
					}				
				}	
				if($scope.selectedTypes.length > 0){
					MetadataTypes.assignMetada($scope.selectedTypes);
					$location.path('/componentList' );					
				}else{
					console.log('@@@@@');
					$scope.pageErrorMessage = 'Please select atleast one Metadata Type';
				}								
			}
		}		
}]);	

