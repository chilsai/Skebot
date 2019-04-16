app.controller('NavigationController',['$scope','$resource','$location','$window','$rootScope','$routeParams','$filter','UserInfoService',
                                 function($scope,$resource,$location,$window,$rootScope,$routeParams,$filter,UserInfoService) {		

	  $scope.userInfo = {};	  
	
	  $rootScope.$on("assignUserInfo", function(){
		  $scope.userInfo = UserInfoService.getuserInfo();
		  console.log('@@@@@@-----22222'+angular.toJson($scope.userInfo));
      });
	  if($window.sessionStorage.getItem('skebotuserinfo')){	
		  $scope.userInfo.Name = $window.sessionStorage.getItem("skebotuserinfo"); 
		  $scope.userInfo.sessionId = $window.sessionStorage.getItem("skebotusersession");
		  $scope.userInfo.instanceUrl = $window.sessionStorage.getItem("skebotInstanceUrl");		  
	  }
		
	  $scope.logout = function(){
		  $scope.userInfo = {};
		  $window.sessionStorage.clear();
		  $location.path('/');
	  }
}]);	

