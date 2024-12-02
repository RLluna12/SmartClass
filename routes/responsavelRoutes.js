
// responsavel.js
const express = require('express');
const router = express.Router();
const responsavelController = require('../controllers/responsavelController');

// すべての生徒のリストを取得
router.get('/', responsavelController.getAllResponsavel);

// 特定の生徒の情報を取得する
router.get('/:id_responsavel', responsavelController.getResponsavelById);


module.exports = router;
