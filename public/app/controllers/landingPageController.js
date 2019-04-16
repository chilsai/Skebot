app.controller('landingPageController',function($scope,$location,$window){
	
	$scope.ladingPageMessage = 'Welcome to Aquela';
	
	$scope.AcceptTAndC = false;
	$scope.AcceptTermsError = false;
	$scope.environment = 'Production';	
	$scope.login = function(){
		if($scope.AcceptTAndC){			  
			$scope.method = 'GET';
			if($scope.environment == 'Production'){
				$scope.url = '/login/oauth2/env/prod';				
			}else{
				$scope.url = '/login/oauth2/env/sand';
			}			
			$location.path($scope.url)			
			$scope.AcceptTermsError = false;
		}else{
			$scope.AcceptTermsError = true;
		}		
	}
	
	if($window.sessionStorage.getItem('skebotuserinfo')){
		$location.path('/home');
	}	
	
});
