// backend/routes/flower.routes.js

const express = require('express');
const router = express.Router();
const flowerController = require('../controllers/flower.controller');
const requireAdmin = require('../middleware/requireAdmin');

// Публичный доступ (конструктор)
router.get('/', flowerController.getAllFlowers);

// Админ: добавление и удаление цветов
router.post('/', requireAdmin, flowerController.createFlower);
router.delete('/:id', requireAdmin, flowerController.deleteFlower);

module.exports = router;
