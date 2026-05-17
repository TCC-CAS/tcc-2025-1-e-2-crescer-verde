const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(authMiddleware, adminMiddleware);

router.post('/', userController.create);
router.get('/', userController.list);
router.get('/:id', userController.get);
router.put('/:id', userController.update);
router.put('/:id/password', userController.changePassword);
router.put('/:id/time-limit', userController.setTimeLimit);
router.get('/:id/guardian-view', userController.guardianView);
router.delete('/:id', userController.delete);

module.exports = router;
