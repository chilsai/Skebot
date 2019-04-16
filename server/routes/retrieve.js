var express = require('express');
var router = express.Router();
var Controller = require('../controllers/login-Controller.js');

/* Login to users SFDC. */
router.post('/', Controller.retrieve);

module.exports = router;
