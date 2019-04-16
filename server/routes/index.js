var express = require('express');
var router = express.Router();

router.use('/login/oauth2', require('./login.js'));

router.use('/api/fetchMetadataTypes', require('./metadataList.js'));

router.use('/api/fetchUserInfo', require('./userInfo.js'));

router.use('/api/retrieve', require('./retrieve.js'));

router.use('/api/retrieveStoredJobs', require('./retrieveJobs.js'));

router.use('/api/deploy', require('./deploy.js'));

router.use('/api/CodeCoverage', require('./CodeCoverage.js'));


module.exports = router;
