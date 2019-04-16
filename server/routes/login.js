var express = require('express');
var router = express.Router();
var loginController = require('../controllers/login-Controller');

/* Login to users SFDC. */
router.get('/env/:envmnt', loginController.Login);


router.get('/callback', loginController.authorizeAndCallBack);


module.exports = router;
