const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const requireAuth = require('../middleware/requireAuth');

router.post('/register', authController.register);        
router.post('/login', authController.login);              
router.post('/refresh', authController.refresh);          
router.post('/logout', authController.logout);            
router.get('/me', requireAuth, authController.getMe);     

module.exports = router;
