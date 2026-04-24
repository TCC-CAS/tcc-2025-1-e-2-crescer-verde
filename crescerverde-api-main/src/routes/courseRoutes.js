const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/', courseController.list);
router.get('/search', courseController.search);
router.get('/:id', courseController.get);

router.use(authMiddleware, adminMiddleware);

router.post('/', authMiddleware, courseController.create);
router.put('/:id', authMiddleware, courseController.update);
router.delete('/:id', authMiddleware, courseController.delete);

module.exports = router;