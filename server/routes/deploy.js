var express = require('express');
var router = express.Router();
var deployController = require('../controllers/deploy-Controller.js');
var sourceController = require('../controllers/login-Controller.js');

/* Login to users SFDC. */
router.post('/login', deployController.Login);
router.post('/deployPackage', sourceController.Deploy);
module.exports = router;
