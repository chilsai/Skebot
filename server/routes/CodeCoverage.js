var express = require('express');
var router = express.Router();
var sourceController = require('../controllers/login-Controller.js');

/* Login to users SFDC. */
router.get('/view', sourceController.getCoverage);
module.exports = router;
