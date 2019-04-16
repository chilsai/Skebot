app.service('UserInfoService', function() {
  var userInfo = {};
  
  var getuserInfo = function(){
      return userInfo;
  };

  var assignuserInfo = function(user){
	  userInfo = user;
  }

  return {
	assignuserInfo: assignuserInfo,	  
	getuserInfo: getuserInfo
  };

});