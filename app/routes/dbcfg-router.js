var router = require('express').Router();

var index = require('../controllers/dbcfg-controller');

router.get('/dbcfg',index.dbcfg);
router.post('/dbcfg',index.dbcfg);

module.exports = router;
