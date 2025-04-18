const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const adminController = require('../controllers/admin.controller');

// Пользователи
router.get('/users', requireAuth, requireAdmin, adminController.getAllUsers);
router.patch('/users/:id/role', requireAuth, requireAdmin, adminController.updateUserRole);

// Заказы
router.get('/orders', requireAuth, requireAdmin, adminController.getAllOrders);
router.get('/orders/:id', requireAuth, requireAdmin, adminController.getOrderById);

// Букеты
router.post('/bouquets', requireAuth, requireAdmin, adminController.createBouquet);

// Загрузка
const upload = require('../utils/multer');
router.post('/uploads', requireAuth, requireAdmin, upload.single('image'), adminController.uploadImage);
// routes/admin.routes.js
router.delete('/bouquets/:id', requireAuth, requireAdmin, adminController.deleteBouquet);
router.patch('/bouquets/:id', requireAuth, requireAdmin, adminController.updateBouquet);
router.get('/bouquets', requireAuth, requireAdmin, adminController.getAllBouquets);
router.patch('/orders/:id', requireAuth, requireAdmin, adminController.updateOrderStatus);

module.exports = router;
