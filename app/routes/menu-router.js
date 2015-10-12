var router = require('express').Router();

var index = require('../controllers/menu-controller');

router.get('/menu',index.menu);

module.exports = router;
