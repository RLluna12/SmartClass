const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/isAuthenticated');
const turmaController = require('../controllers/turmaController');

// ユーザー関連のルート
router.get('/home', isAuthenticated, userController.getUserProfile);


module.exports = router;
