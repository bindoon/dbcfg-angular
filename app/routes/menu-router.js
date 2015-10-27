var router = require('express').Router();

var index = require('../controllers/menu-controller');

router.get('/menu',index.menu);
router.get('/menucfg', index.menucfg);
router.post('/menucfg', index.menucfg);
module.exports = router;
