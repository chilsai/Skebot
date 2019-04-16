app.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/partials/landingPage.html',
        controller: 'landingPageController',        
    })
    .when('/login/oauth2/env/prod', {        
    	resolve:{
    		"check":function($window,$location){   //function to be resolved, accessFac and $location Injected      			    			
    			$window.location.href = '/login/oauth2/env/prod';    				    		
    		}
    	}         
    })
    .when('/login/oauth2/env/sand', {        
    	resolve:{
    		"check":function($window,$location){   //function to be resolved, accessFac and $location Injected      			    			
    			$window.location.href = '/login/oauth2/env/sand';    				    		
    		}
    	}         
    })     
    .when('/home', {        
        templateUrl: 'views/partials/retieiveJobsList.html',
        controller: 'RetreiveJobsController',          
    })
    .when('/retreivehome', {        
        templateUrl: 'views/partials/metadataList.html',
        controller: 'MetadataListController',          
    })    
    .when('/componentList', {        
        templateUrl: 'views/partials/componentList.html',
        controller: 'ComponentListController',          
    })     
    .when('/retrieve', {        
        templateUrl: 'views/partials/retieiveList.html',
        controller: 'RetrieveController',          
    })  
    .when('/CodeCoverage', {        
        templateUrl: 'views/partials/CodeCoverageList.html',
        controller: 'CodeCoverageController',          
    })      
    .otherwise({    	
        redirectTo: '/'
    });
    $locationProvider.html5Mode({
    	  enabled: true,
    	  requireBase: false
	});
}]);