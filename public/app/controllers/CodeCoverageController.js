app.controller('CodeCoverageController',['$scope','$resource','$location','$window','$rootScope','$routeParams','$filter','MetadataTypes','UserInfoService',
                                 function($scope,$resource,$location,$window,$rootScope,$routeParams,$filter,MetadataTypes,UserInfoService) {
		//function($scope, $filter,$resource,$routeParams,$window,$rootScope,$location){

		var sortingOrder = 'Name'; //default sort
		$scope.loading = false;	
		$scope.itemsToDownload = [];
		
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
		  angular.forEach(metaData,function(value,index){
              console.log('!_-----'+$filter('date')(value.CreatedDate, 'medium'));
              value.CreatedDate = $filter('date')(value.CreatedDate, 'medium');
          })
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
		      //console.log('@@@@@@----'+angular.toJson(item));		      		     
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
		      console.log('@@@@@@--Field--'+newSortingOrder);
		      $scope.sortingOrder = newSortingOrder;
		  };

		};
		
		if(!$window.sessionStorage.getItem('skebotuserinfo')){
			var userInfo = $resource('/api/fetchUserInfo');
			var userInfo = userInfo.query(function(){		
				console.log('In SSS Error usinfi'+angular.toJson(userInfo, true));								
				// Assign user Info to Serivce -- Passing to Navigation Controller
				var userIn = {};
				userIn.username = userInfo[0].userInfo.Name;
				userIn.sessionId = userInfo[0].sessionId;
				userIn.instanceUrl = userInfo[0].instanceUrl;
				UserInfoService.assignuserInfo(userIn);				
				// Invoking method on Navigation Controller
				$rootScope.$emit("assignUserInfo", {});				
				if(userInfo[0]){
					$window.sessionStorage.setItem('skebotuserinfo',userInfo[0].userInfo.Name);
					$window.sessionStorage.setItem('skebotusersession',userInfo[0].sessionId);
					$window.sessionStorage.setItem('skebotInstanceUrl',userInfo[0].instanceUrl);
				}else{
					$location.path('/');
				}				
			});
		}
		
		var sfAuth = $resource('/api/CodeCoverage/view');
		//var sfAuth = $resource('/api/retrieveStoredJobs');
		$scope.loading = true;
		var dataList = [];
		var metaData = sfAuth.query(function(){											
			//initApp(metaData);
			$scope.TotalLines = 0;
			$scope.TotalLinesCovered = 0;
			$scope.TotalLinesUnCovered = 0;
			for (i = 0; i < metaData.length; i++) { 
				var component = {};
				component.Id = metaData[i].ApexClassOrTriggerId;
				component.Name = '';
				if(metaData[i].ApexClassOrTrigger){
					component.Name =  metaData[i].ApexClassOrTrigger.Name;	
				}				
				component.NumLinesCovered =  metaData[i].NumLinesCovered;
				component.NumLinesUncovered =  metaData[i].NumLinesUncovered;
				component.TotalNumberOfLines =  metaData[i].NumLinesCovered+metaData[i].NumLinesUncovered;
				component.TotalPercentage =  (metaData[i].NumLinesCovered/component.TotalNumberOfLines)*100;
				$scope.TotalLines = $scope.TotalLines + component.TotalNumberOfLines;
				$scope.TotalLinesCovered = $scope.TotalLinesCovered + component.NumLinesCovered;
				$scope.TotalLinesUnCovered = $scope.TotalLinesUnCovered + component.NumLinesUncovered;
				dataList.push(component);
				$scope.itemsToDownload.push(component)
				if(i === metaData.length - 1){
					var Overallcomponent = {};
					Overallcomponent.Id = '';
					Overallcomponent.Name = 'Overall Coverage';
					Overallcomponent.NumLinesCovered =  $scope.TotalLinesCovered;
					Overallcomponent.NumLinesUncovered =  $scope.TotalLinesUnCovered;
					Overallcomponent.TotalNumberOfLines =  $scope.TotalLines;
					var percent = ($scope.TotalLinesCovered/$scope.TotalLines)*100;
					Overallcomponent.TotalPercentage =  $filter('number')(percent, 2);
					//dataList.push(Overallcomponent);
					$scope.itemsToDownload.push(Overallcomponent)
				}				
			}
			initApp(dataList);					
			$scope.loading = false;
		});

		$scope.openRecordinSF = function(recordId){
			var baseurl = $window.sessionStorage.getItem("skebotInstanceUrl");
			console.log('@@@@@@--'+recordId);
			window.open(baseurl+'/'+recordId);
		}		
		
}]);	

