const express = require('express');
const router = express.Router();
const courseContentController = require('../controllers/courseContentController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.use(authMiddleware);

// Mutações: apenas admin
router.post('/create', adminMiddleware, courseContentController.create);
router.post('/update/:id', adminMiddleware, courseContentController.update);
router.post('/delete/:id', adminMiddleware, courseContentController.delete);

// Leitura: qualquer usuário autenticado
router.post('/get/:id', courseContentController.get);
router.post('/listByCourseId/:courseId', courseContentController.listByCourseId);

module.exports = router;
