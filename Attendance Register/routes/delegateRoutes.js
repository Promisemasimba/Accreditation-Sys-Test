const express = require('express');
const router = express.Router();
const delegateController = require('../controllers/delegateController');

router.get('/delegates', delegateController.getAllDelegates);
router.get('/delegates/:id', delegateController.getDelegateById);

module.exports = router;
