const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.post('/', orderController.createOrder);               // POST /api/orders
router.get('/', orderController.getOrders);                  // GET /api/orders
router.get('/:id', orderController.getOrderById);            // GET /api/orders/:id

module.exports = router;
