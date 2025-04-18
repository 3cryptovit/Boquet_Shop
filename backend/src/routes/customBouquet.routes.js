const express = require('express');
const router = express.Router();
const customBouquetController = require('../controllers/customBouquet.controller');
const requireAuth = require('../middleware/requireAuth');

// 🔒 Только авторизованные
router.post('/', requireAuth, customBouquetController.createCustomBouquet);
router.get('/:id', requireAuth, customBouquetController.getCustomBouquetById);

module.exports = router;
