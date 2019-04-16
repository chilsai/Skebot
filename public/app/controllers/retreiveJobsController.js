app.controller('RetreiveJobsController',['$scope','$resource','$location','$window','$rootScope','$routeParams','$filter','MetadataTypes','UserInfoService',
                                 function($scope,$resource,$location,$window,$rootScope,$routeParams,$filter,MetadataTypes,UserInfoService) {
		//function($scope, $filter,$resource,$routeParams,$window,$rootScope,$location){

		var sortingOrder = 'CreatedDate'; //default sort
		$scope.loading = false;	
		
		function initApp(metaData) {
		 
		  // init
		  $scope.sortingOrder = sortingOrder;
		  $scope.pageSizes = [5,10,25];
		  $scope.reverse = true;
		  $scope.filteredItems = [];
		  $scope.groupedItems = [];
		  $scope.itemsPerPage = 10;
		  $scope.pagedItems = [];
		  $scope.currentPage = 0;
		  //$scope.items = generateData();
		  angular.forEach(metaData,function(value,index){
              console.log('!_-----'+$filter('date')(value.CreatedDate, 'medium'));
              //value.CreatedDate = $filter('date')(value.CreatedDate, 'medium');
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
		      console.log('in Srch @@@@@@----'+angular.toJson($scope.sortingOrder));		      		     
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
				userIn.Name = userInfo[0].userInfo.Name;
				userIn.Username = userInfo[0].userInfo.Username;
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
		
		var sfAuth = $resource('/api/retrieveStoredJobs');
		$scope.loading = true;
		var metaData = sfAuth.query(function(){								
			if(!metaData || metaData === 'undefined'){
				$window.sessionStorage.removeItem('skebotuserinfo');
				$location.path('/');				
			}else{				
				initApp(metaData);					
			}
			$scope.loading = false;
		});
		
		$scope.selectedTypes = [];
		$rootScope.openRetreivePage = function(){
			$location.path('/retreivehome' );
		}
		
		$scope.openRecordinSF = function(recordId){
			var baseurl = $window.sessionStorage.getItem("skebotInstanceUrl");
			console.log('@@@@@@--'+recordId);
			window.open(baseurl+'/'+recordId);
		}
		

		// Deployment Veriables
		$scope.environment = 'Production';
		$scope.selectedPackageName = '';
		$scope.selectedPackageId = '';
		$scope.isLoggedIn = false;
		$scope.deploymentInProgress = false;
		$scope.deployResults = {};
		
		$scope.selectedPackage = function(packageName,packageId){
			$scope.deployResults = null;
			console.log('@@@@@@@@@@@@@@@@@'+packageName);
			$scope.selectedPackageName = packageName;
			$scope.selectedPackageId = packageId;			
		}
		
		$scope.DeployLogin = function(){
			console.log('!!!!!!!!!!!!--');
			var sfAuth = $resource('/api/deploy/login');
			var userDetails = new sfAuth();	
			userDetails.username = $scope.deployUsername;
			userDetails.password = $scope.deployUserpassword;
			userDetails.environment = $scope.environment;			
			var re = userDetails.$save(function(results) {
				  if(results && results.status){
					  $scope.isLoggedIn = true;
				  }else{
					  $scope.LoginFailure = 'Invalid username and Password';
				  }
				  console.log('DE result---'+angular.toJson(results, true));
			});				
		}

		$scope.Deploy = function(){
			console.log('!!!!!!!!!!!!-- in deploy'+$scope.selectedPackageId);
			$scope.deploymentInProgress = true;
			var sfAuth = $resource('/api/deploy/deployPackage');
			var packageDetails = new sfAuth();
			packageDetails.recordId = $scope.selectedPackageId;
			var re = packageDetails.$save(function(results) {				  
				  console.log('deploy result---'+angular.toJson(results, true));
				  $scope.deploymentInProgress = false;
				  $scope.deployResults = results;
			});
			
		}
		
		
}]);	

