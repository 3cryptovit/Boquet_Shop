const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart.controller');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

router.get('/', cartController.getCart);                          // GET /api/cart
router.post('/', cartController.addToCart);                       // POST /api/cart
router.post('/custom', cartController.addCustomToCart);          // POST /api/cart/custom
router.put('/:id', cartController.updateQuantity);               // PUT /api/cart/:id
router.delete('/:id', cartController.removeFromCart);            // DELETE /api/cart/:id

module.exports = router;
