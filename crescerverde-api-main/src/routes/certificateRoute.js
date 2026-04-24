const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');

router.post('/', certificateController.create);
router.get('/user/:userId', certificateController.getByUserId);
router.get('/:certificateId', certificateController.get);

module.exports = router;