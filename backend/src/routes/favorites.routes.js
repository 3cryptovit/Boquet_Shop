const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const favoritesController = require('../controllers/favorites.controller');

router.use(requireAuth);

router.get('/', favoritesController.getFavorites);
router.post('/:id', favoritesController.addFavorite);
router.delete('/:id', favoritesController.removeFavorite);

module.exports = router;
