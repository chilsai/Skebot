var express = require('express');
var router = express.Router();
var Controller = require('../controllers/login-Controller.js');

/* Login to users SFDC. */
router.get('/', Controller.getUserInfo);

module.exports = router;
