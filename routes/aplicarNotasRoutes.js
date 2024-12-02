// routes/aplicarNotasRoutes.js
const express = require('express');
const router = express.Router();
const aplicarNotasController = require('../controllers/aplicarNotasController');

router.get('/notas', aplicarNotasController.fetchNotasFaltas);

module.exports = router;
