const express = require('express');
const router = express.Router();
const courseContentController = require('../controllers/courseContentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/create', courseContentController.create);
router.post('/update/:id', courseContentController.update);
router.post('/delete/:id', courseContentController.delete);
router.post('/get/:id', courseContentController.get);
router.post('/listByCourseId/:courseId', courseContentController.listByCourseId);

module.exports = router;