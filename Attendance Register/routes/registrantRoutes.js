const express = require('express');
const router = express.Router();
const registrantController = require('../controllers/registrantController');

// Routes for Registrants
router.get('/registrants', registrantController.getAllRegistrants);
router.get('/registrants/:id', registrantController.getRegistrantById);
router.post('/registrants', registrantController.createRegistrant);
router.put('/registrants/:id', registrantController.updateRegistrant);
router.delete('/registrants/:id', registrantController.deleteRegistrant);

module.exports = router;
