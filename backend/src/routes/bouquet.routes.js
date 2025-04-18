const express = require('express');
const router = express.Router();
const bouquetController = require('../controllers/bouquet.controller');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

// 🌐 Публичные
router.get('/', bouquetController.getAllPublicBouquets);
router.get('/:id', bouquetController.getBouquetById);

// 🔒 Только для админа
router.post('/', requireAuth, requireAdmin, bouquetController.createBouquet);
router.delete('/:id', requireAuth, requireAdmin, bouquetController.deleteBouquet);

module.exports = router;
