var express = require('express');
var router = express.Router();
var Controller = require('../controllers/login-Controller.js');

/* Login to users SFDC. */
router.get('/', Controller.fetchMetadata);

router.post('/componentList', Controller.fetchComponents);

module.exports = router;
